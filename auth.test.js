'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createAppServer } = require('./server');

async function startServer(t, options = {}) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'bloxforge-auth-test-'));
  const dataPath = path.join(directory, 'database.json');
  const app = createAppServer({ port: 0, dataPath, sessionTtlMs: options.sessionTtlMs || 10_000 });
  await app.ready;
  await new Promise((resolve, reject) => {
    app.server.once('error', reject);
    app.server.listen(0, '127.0.0.1', resolve);
  });
  const baseUrl = 'http://127.0.0.1:' + app.server.address().port;
  t.after(async () => {
    await new Promise(resolve => app.server.close(resolve));
    await fs.rm(directory, { recursive: true, force: true });
  });
  return { app, baseUrl, origin: baseUrl, dataPath };
}

async function call(context, route, { method = 'GET', body, cookie, origin = context.origin } = {}) {
  const headers = { Origin: origin };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(context.baseUrl + route, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const payload = await response.json();
  return {
    response, payload,
    setCookie: response.headers.get('set-cookie') || '',
    cookie: response.headers.get('set-cookie')?.split(';')[0] || cookie
  };
}

async function register(context, email, role) {
  const created = await call(context, '/api/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email, password: 'Local-Test-Password-42' }
  });
  assert.equal(created.response.status, 200);
  const completed = await call(context, '/api/onboarding', {
    method: 'POST',
    cookie: created.cookie,
    body: { discovery: 'youtube', attributionName: 'Blox Creator', whyBloxforge: 'Learn and build Roblox games.', role }
  });
  assert.equal(completed.response.status, 200);
  return { cookie: created.cookie, user: completed.payload.user };
}

test('consumer onboarding is required and creator permissions are enforced server-side', async t => {
  const context = await startServer(t);
  const anonymous = await call(context, '/api/courses');
  assert.equal(anonymous.response.status, 401);
  const crossOrigin = await call(context, '/api/auth/register', {
    method: 'POST', origin: 'https://attacker.example',
    body: { name: 'Test', email: 'cross-origin@example.test', password: 'local-test-password-42' }
  });
  assert.equal(crossOrigin.response.status, 403);

  const registered = await call(context, '/api/auth/register', {
    method: 'POST',
    body: { name: 'Local Creator', email: 'creator@example.test', password: 'Local-Test-Password-42' }
  });
  assert.equal(registered.response.status, 200);
  assert.match(registered.cookie, /^bloxforge_session=/);
  assert.match(registered.setCookie, /HttpOnly/);
  assert.match(registered.setCookie, /SameSite=Strict/);
  assert.equal(Object.hasOwn(registered.payload.user, 'passwordHash'), false);
  const incomplete = await call(context, '/api/courses', { cookie: registered.cookie });
  assert.equal(incomplete.response.status, 403);

  const onboarding = await call(context, '/api/onboarding', {
    method: 'POST', cookie: registered.cookie,
    body: { discovery: 'friend', attributionName: 'A test friend', whyBloxforge: 'I want to build courses.', role: 'consumer' }
  });
  assert.equal(onboarding.response.status, 200);
  assert.equal(onboarding.payload.user.role, 'consumer');
  assert.equal(onboarding.payload.user.onboarding.attributionName, 'A test friend');

  const denied = await call(context, '/api/courses', {
    method: 'POST', cookie: registered.cookie,
    body: { title: 'A test course', description: 'Course description.', price: 10, lessons: ['First lesson'] }
  });
  assert.equal(denied.response.status, 403);

  const upgrade = await call(context, '/api/profile/role', {
    method: 'POST', cookie: registered.cookie, body: { role: 'creator' }
  });
  assert.equal(upgrade.response.status, 200);
  assert.equal(upgrade.payload.user.role, 'creator');
  const downgrade = await call(context, '/api/profile/role', {
    method: 'POST', cookie: registered.cookie, body: { role: 'consumer' }
  });
  assert.equal(downgrade.response.status, 400);
  const repeatedUpgrade = await call(context, '/api/profile/role', {
    method: 'POST', cookie: registered.cookie, body: { role: 'creator' }
  });
  assert.equal(repeatedUpgrade.response.status, 409);

  const course = await call(context, '/api/courses', {
    method: 'POST', cookie: registered.cookie,
    body: { title: 'My test course', description: 'Course description.', price: 10.5, lessons: ['First lesson'] }
  });
  assert.equal(course.response.status, 201);
  assert.equal(course.payload.course.ownerId, registered.payload.user.id);
  const publicCourses = await call(context, '/api/courses', { cookie: registered.cookie });
  assert.equal(publicCourses.payload.courses[0].title, 'My test course');
  const logout = await call(context, '/api/auth/logout', { method: 'POST', cookie: registered.cookie });
  assert.equal(logout.response.status, 200);
  const afterLogout = await call(context, '/api/courses', { cookie: registered.cookie });
  assert.equal(afterLogout.response.status, 401);
});

test('creators cannot edit or delete another creator’s courses', async t => {
  const context = await startServer(t);
  const first = await register(context, 'first@example.test', 'creator');
  const second = await register(context, 'second@example.test', 'creator');
  const course = await call(context, '/api/courses', {
    method: 'POST', cookie: first.cookie,
    body: { title: 'Owned course', description: 'Course description.', price: 0, lessons: ['First lesson'] }
  });
  assert.equal(course.response.status, 201);
  const changed = await call(context, '/api/courses/' + course.payload.course.id, {
    method: 'PUT', cookie: second.cookie,
    body: { title: 'Stolen course', description: 'Course description.', price: 0, lessons: ['First lesson'] }
  });
  assert.equal(changed.response.status, 404);
  const removed = await call(context, '/api/courses/' + course.payload.course.id, {
    method: 'DELETE', cookie: second.cookie
  });
  assert.equal(removed.response.status, 404);
});

test('profile updates persist and remain isolated between users', async t => {
  const context = await startServer(t);
  const first = await register(context, 'profile-one@example.test', 'consumer');
  const second = await register(context, 'profile-two@example.test', 'consumer');
  const changed = await call(context, '/api/profile', { method: 'POST', cookie: first.cookie, body: { name: 'Updated Name' } });
  assert.equal(changed.response.status, 200);
  assert.equal(changed.payload.user.name, 'Updated Name');
  const firstSession = await call(context, '/api/session', { cookie: first.cookie });
  const secondSession = await call(context, '/api/session', { cookie: second.cookie });
  assert.equal(firstSession.payload.user.name, 'Updated Name');
  assert.equal(secondSession.payload.user.name, 'Test User');
  const invalid = await call(context, '/api/profile', { method: 'POST', cookie: first.cookie, body: { name: 'x' } });
  assert.equal(invalid.response.status, 400);
});

test('password change verifies current password and revokes the old credential', async t => {
  const context = await startServer(t);
  const user = await register(context, 'password@example.test', 'consumer');
  const wrongCurrent = await call(context, '/api/auth/password', { method: 'POST', cookie: user.cookie, body: { currentPassword: 'Wrong-Password-22', newPassword: 'New-Password-2026' } });
  assert.equal(wrongCurrent.response.status, 403);
  const changed = await call(context, '/api/auth/password', { method: 'POST', cookie: user.cookie, body: { currentPassword: 'Local-Test-Password-42', newPassword: 'New-Password-2026' } });
  assert.equal(changed.response.status, 200);
  assert.equal((await call(context, '/api/auth/login', { method: 'POST', body: { email: 'password@example.test', password: 'Local-Test-Password-42' } })).response.status, 401);
  assert.equal((await call(context, '/api/auth/login', { method: 'POST', body: { email: 'password@example.test', password: 'New-Password-2026' } })).response.status, 200);
});

test('logout revokes the session and expired sessions are rejected', async t => {
  const context = await startServer(t, { sessionTtlMs: 150 });
  const user = await register(context, 'session@example.test', 'consumer');
  assert.equal((await call(context, '/api/auth/logout', { method: 'POST', cookie: user.cookie })).response.status, 200);
  assert.equal((await call(context, '/api/courses', { cookie: user.cookie })).response.status, 401);
  const expiring = await register(context, 'expiry@example.test', 'consumer');
  await new Promise(resolve => setTimeout(resolve, 180));
  assert.equal((await call(context, '/api/courses', { cookie: expiring.cookie })).response.status, 401);
});

test('local user records persist hashed passwords and sensitive server files are not web-accessible', async t => {
  const context = await startServer(t);
  const registered = await register(context, 'persistent@example.test', 'consumer');
  const database = JSON.parse(await fs.readFile(context.dataPath, 'utf8'));
  assert.equal(database.users[0].password, undefined);
  assert.equal(database.users[0].passwordHash.length, 128);
  assert.equal(database.users[0].salt.length, 32);
  assert.equal(database.users[0].role, 'consumer');
  assert.equal(database.users[0].onboarding.discovery, 'youtube');

  const exposedServer = await fetch(context.baseUrl + '/server.js');
  assert.equal(exposedServer.status, 404);
  const script = await fetch(context.baseUrl + '/script.js');
  assert.equal(script.status, 200);
  assert.equal(script.headers.get('x-frame-options'), 'DENY');
  assert.match(script.headers.get('content-security-policy'), /object-src 'none'/);
  assert.equal((await call(context, '/api/session')).payload.user, null);
  assert.ok(registered.cookie);
});
