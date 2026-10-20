'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const ROOT = __dirname;
const PASSWORD_BYTES = 64;
const PASSWORD_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const DISCOVERY_SOURCES = new Set(['youtube', 'social', 'friend', 'search', 'roblox', 'other']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    onboarding: user.onboarding
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateCourse(input) {
  if (!isPlainObject(input) || typeof input.title !== 'string' ||
      typeof input.description !== 'string' || !Number.isFinite(input.price) ||
      input.price < 0 || input.price > 10000 || !Array.isArray(input.lessons) ||
      input.lessons.length < 1 || input.lessons.length > 30) {
    throw new HttpError(400, 'Vérifiez les informations de la formation.');
  }
  const title = input.title.trim();
  const description = input.description.trim();
  const lessons = input.lessons.map(item => typeof item === 'string' ? item.trim() : '');
  if (title.length < 3 || title.length > 80 || description.length < 3 ||
      description.length > 360 || lessons.some(item => !item || item.length > 120)) {
    throw new HttpError(400, 'Vérifiez les limites de longueur de la formation.');
  }
  const document = input.document === undefined ? null : validateCourseDocument(input.document);
  const expectedVersion = Number.isInteger(input.expectedVersion) && input.expectedVersion > 0 ? input.expectedVersion : undefined;
  return { title, description, price: Math.round(input.price * 100) / 100, lessons, ...(document ? { document } : {}), ...(expectedVersion ? { expectedVersion } : {}) };
}

function validateCourseDocument(document) {
  if (!isPlainObject(document) || !Array.isArray(document.modules) || document.modules.length > 30) throw new HttpError(400, 'Structure de formation invalide.');
  let lessonCount = 0, blockCount = 0;
  const ids = new Set();
  const uniqueId = id => { if (typeof id !== 'string' || !/^[\w-]{1,80}$/.test(id) || ids.has(id)) throw new HttpError(400, 'Identifiant de contenu invalide ou dupliqué.'); ids.add(id); };
  const modules = document.modules.map((module, mi) => {
    if (!isPlainObject(module) || typeof module.title !== 'string' || !module.title.trim() || module.title.length > 120 || !Array.isArray(module.lessons)) throw new HttpError(400, 'Module invalide.');
    uniqueId(module.id);
    const lessons = module.lessons.map((lesson, li) => {
      if (!isPlainObject(lesson) || typeof lesson.title !== 'string' || !lesson.title.trim() || lesson.title.length > 120 || !Array.isArray(lesson.blocks)) throw new HttpError(400, 'Leçon invalide.');
      if (++lessonCount > 200) throw new HttpError(400, 'La formation dépasse 200 leçons.'); uniqueId(lesson.id);
      const blocks = lesson.blocks.map(block => {
        if (!isPlainObject(block) || !['text', 'code', 'challenge', 'quiz'].includes(block.type) || typeof block.content !== 'string' || block.content.length > 20000) throw new HttpError(400, 'Bloc de contenu invalide.');
        if (++blockCount > 1000) throw new HttpError(400, 'La formation dépasse 1000 blocs.'); uniqueId(block.id);
        const clean = { id: block.id, type: block.type, content: block.content };
        if (block.type === 'code') {
          clean.language = String(block.language || 'luau').slice(0, 30);
          clean.filename = String(block.filename || '').slice(0, 120);
          clean.explanation = String(block.explanation || '').slice(0, 1000);
        }
        if (block.type === 'challenge') {
          clean.objective = String(block.objective || '').slice(0, 500);
          clean.deliverable = String(block.deliverable || '').slice(0, 500);
        }
        if (block.type === 'quiz') {
          if (typeof block.question !== 'string' || block.question.length > 1000 || !Array.isArray(block.choices) || block.choices.length < 2 || block.choices.length > 8) throw new HttpError(400, 'Question de quiz invalide.');
          clean.question = block.question.trim();
          clean.choices = block.choices.map(choice => String(choice).trim().slice(0, 300));
          clean.correct = Math.max(0, Math.min(clean.choices.length - 1, Number(block.correct) || 0));
          if (!clean.question || clean.choices.some(choice => !choice)) throw new HttpError(400, 'Complétez la question et toutes les réponses du quiz.');
        }
        return clean;
      });
      return { id: lesson.id, title: lesson.title.trim(), position: li, type: 'content', durationMinutes: Math.max(0, Math.min(600, Number(lesson.durationMinutes) || 0)), blocks };
    });
    return { id: module.id, title: module.title.trim(), description: String(module.description || '').slice(0, 500), position: mi, lessons };
  });
  return { modules };
}

function migrateLegacyCourse(course) {
  if (course.document) return course;
  return { ...course, version: 1, status: 'published', document: { modules: [{ id: 'legacy-' + course.id, title: 'Programme', description: '', position: 0, lessons: (course.lessons || []).map((title, i) => ({ id: 'legacy-' + course.id + '-lesson-' + i, title, position: i, type: 'content', durationMinutes: 0, blocks: [{ id: 'legacy-' + course.id + '-block-' + i, type: 'text', content: title }] })) }] } };
}

function createLocalRepository(filePath) {
  let database = { version: 1, users: [], courses: [] };
  let writes = Promise.resolve();

  function transact(change) {
    const operation = writes.then(async () => {
      const { next, result } = change(database);
      const directory = path.dirname(filePath);
      await fs.mkdir(directory, { recursive: true, mode: 0o700 });
      const temporaryPath = filePath + '.' + crypto.randomBytes(8).toString('hex') + '.tmp';
      try {
        await fs.writeFile(temporaryPath, JSON.stringify(next), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
        await fs.rename(temporaryPath, filePath);
        database = next;
        return result;
      } catch (error) {
        try { await fs.unlink(temporaryPath); } catch (cleanupError) {
          if (cleanupError.code !== 'ENOENT') console.error('Could not remove temporary account data file.');
        }
        throw error;
      }
    });
    writes = operation.catch(() => {});
    return operation;
  }

  return {
    async init() {
      try {
        const raw = JSON.parse(await fs.readFile(filePath, 'utf8'));
        if (!isPlainObject(raw) || raw.version !== 1 || !Array.isArray(raw.users) || !Array.isArray(raw.courses)) {
          throw new Error('Local account store has an unsupported format.');
        }
        database = { ...raw, courses: raw.courses.map(migrateLegacyCourse) };
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    },
    findUserByEmail(email) {
      return database.users.find(user => user.email === email) || null;
    },
    findUserById(id) {
      return database.users.find(user => user.id === id) || null;
    },
    async createUser(user) {
      return transact(current => {
        if (current.users.some(existing => existing.email === user.email)) {
          throw new HttpError(409, 'Un compte existe déjà pour cet e-mail.');
        }
        return { next: { ...current, users: [...current.users, user] }, result: user };
      });
    },
    async updateUser(id, update) {
      return transact(current => {
        const existing = current.users.find(user => user.id === id);
        if (!existing) throw new HttpError(404, 'Compte introuvable.');
        const updated = { ...existing, ...update };
        return { next: { ...current, users: current.users.map(user => user.id === id ? updated : user) }, result: updated };
      });
    },
    listCourses() {
      return database.courses;
    },
    async createCourse(course) {
      return transact(current => ({ next: { ...current, courses: [...current.courses, course] }, result: course }));
    },
    async updateCourse(id, ownerId, update) {
      return transact(current => {
        const existing = current.courses.find(course => course.id === id);
        if (!existing || existing.ownerId !== ownerId) throw new HttpError(404, 'Formation introuvable.');
        if (Number.isInteger(update.expectedVersion) && update.expectedVersion !== (existing.version || 1)) throw new HttpError(409, 'Cette formation a été modifiée ailleurs. Rechargez-la avant de continuer.');
        const { expectedVersion, ...safeUpdate } = update;
        const updated = { ...existing, ...safeUpdate, version: (existing.version || 1) + 1, updatedAt: new Date().toISOString() };
        return { next: { ...current, courses: current.courses.map(course => course.id === id ? updated : course) }, result: updated };
      });
    },
    async deleteCourse(id, ownerId) {
      return transact(current => {
        const existing = current.courses.find(course => course.id === id);
        if (!existing || existing.ownerId !== ownerId) throw new HttpError(404, 'Formation introuvable.');
        return { next: { ...current, courses: current.courses.filter(course => course.id !== id) }, result: undefined };
      });
    }
  };
}

function createAppServer(options = {}) {
  const port = options.port === undefined ? Number(process.env.PORT || 4173) : options.port;
  const sessionTtlMs = options.sessionTtlMs || SESSION_TTL_MS;
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new TypeError('PORT must be an integer between 0 and 65535.');
  const repository = options.repository || createLocalRepository(
    options.dataPath || process.env.BLOXFORGE_DATA_PATH || path.join(ROOT, 'local-data', 'database.json')
  );
  const sessions = new Map();
  const attempts = new Map();
  const ready = repository.init();

  function headers(response, api = false) {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
    response.setHeader('Cache-Control', api ? 'no-store' : 'no-cache');
  }

  function sendJson(response, status, data) {
    headers(response, true);
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(data));
  }

  function setSessionCookie(response, token) {
    response.setHeader('Set-Cookie', 'bloxforge_session=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + Math.floor(SESSION_TTL_MS / 1000) + (process.env.NODE_ENV === 'production' ? '; Secure' : ''));
  }

  function clearSessionCookie(response) {
    response.setHeader('Set-Cookie', 'bloxforge_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' + (process.env.NODE_ENV === 'production' ? '; Secure' : ''));
  }

  function sessionUser(request) {
    const cookies = (request.headers.cookie || '').split(';').map(item => item.trim());
    const cookie = cookies.find(item => item.startsWith('bloxforge_session='));
    const token = cookie && cookie.slice('bloxforge_session='.length);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const key = crypto.createHash('sha256').update(token).digest('hex');
    const session = sessions.get(key);
    if (!session || session.expiresAt <= Date.now()) {
      sessions.delete(key);
      return null;
    }
    return repository.findUserById(session.userId);
  }

  function requireUser(request) {
    const user = sessionUser(request);
    if (!user) throw new HttpError(401, 'Veuillez vous connecter pour continuer.');
    if (!user.onboarding) throw new HttpError(403, 'Terminez votre questionnaire pour continuer.');
    return user;
  }

  function requireCreator(user) {
    if (user.role !== 'creator') throw new HttpError(403, 'Le mode créateur est nécessaire pour gérer des formations.');
  }

  function checkOrigin(request) {
    const actualPort = port === 0 && server.address() ? server.address().port : port;
    const expected = new Set(['http://127.0.0.1:' + actualPort, 'http://localhost:' + actualPort]);
    if (!expected.has(request.headers.origin)) throw new HttpError(403, 'Origine de requête non autorisée.');
  }

  function checkRateLimit(request, key) {
    const now = Date.now();
    const ip = request.socket.remoteAddress || 'local';
    const limitKey = ip + ':' + key;
    const current = attempts.get(limitKey);
    if (!current || current.resetAt <= now) {
      attempts.set(limitKey, { count: 1, resetAt: now + 15 * 60 * 1000 });
      return;
    }
    current.count++;
    if (current.count > 8) throw new HttpError(429, 'Trop de tentatives. Réessayez dans quelques minutes.');
  }

  async function readJson(request) {
    if (!String(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      throw new HttpError(415, 'Format JSON requis.');
    }
    let body = '';
    for await (const chunk of request) {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new HttpError(413, 'Requête trop volumineuse.');
    }
    let data;
    try { data = JSON.parse(body); } catch {
      throw new HttpError(400, 'Requête JSON invalide.');
    }
    if (!isPlainObject(data)) throw new HttpError(400, 'Corps de requête invalide.');
    return data;
  }

  async function issueSession(response, user) {
    const token = crypto.randomBytes(32).toString('hex');
    const key = crypto.createHash('sha256').update(token).digest('hex');
    sessions.set(key, { userId: user.id, expiresAt: Date.now() + sessionTtlMs });
    setSessionCookie(response, token);
    sendJson(response, 200, { user: publicUser(user) });
  }

  async function routeApi(request, response, url) {
    if (request.method === 'GET' && url.pathname === '/api/session') {
      const user = sessionUser(request);
      return sendJson(response, 200, { user: user ? publicUser(user) : null });
    }

    if (request.method === 'POST') checkOrigin(request);

    if (request.method === 'POST' && url.pathname === '/api/auth/register') {
      checkRateLimit(request, 'register');
      const input = await readJson(request);
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
      const password = input.password;
      if (name.length < 2 || name.length > 80 || !EMAIL_PATTERN.test(email) ||
          email.length > 254 || typeof password !== 'string' || password.length < 10 ||
          password.length > 128 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new HttpError(400, 'Indiquez un nom, un e-mail valide et un mot de passe de 10 à 128 caractères.');
      }
      if (repository.findUserByEmail(email)) throw new HttpError(409, 'Un compte existe déjà pour cet e-mail.');
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = await scrypt(password, salt, PASSWORD_BYTES, PASSWORD_OPTIONS);
      const user = {
        id: crypto.randomUUID(), name, email, salt, passwordHash: passwordHash.toString('hex'),
        role: null, onboarding: null, createdAt: new Date().toISOString()
      };
      await repository.createUser(user);
      return issueSession(response, user);
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      checkRateLimit(request, 'login');
      const input = await readJson(request);
      const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
      const password = typeof input.password === 'string' ? input.password : '';
      if (password.length > 128) throw new HttpError(401, 'E-mail ou mot de passe incorrect.');
      const user = repository.findUserByEmail(email);
      const salt = user ? user.salt : '00000000000000000000000000000000';
      const expected = user ? Buffer.from(user.passwordHash, 'hex') : Buffer.alloc(PASSWORD_BYTES);
      const actual = Buffer.from(await scrypt(password.slice(0, 128), salt, PASSWORD_BYTES, PASSWORD_OPTIONS));
      if (!user || actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
        throw new HttpError(401, 'E-mail ou mot de passe incorrect.');
      }
      return issueSession(response, user);
    }

    if (request.method === 'POST' && url.pathname === '/api/profile') {
      checkOrigin(request);
      const user = requireUser(request);
      const input = await readJson(request);
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      if (name.length < 2 || name.length > 80) throw new HttpError(400, 'Le nom doit contenir entre 2 et 80 caractères.');
      const updated = await repository.updateUser(user.id, { name });
      return sendJson(response, 200, { user: publicUser(updated) });
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/password') {
      checkOrigin(request);
      const user = requireUser(request);
      const input = await readJson(request);
      const currentPassword = typeof input.currentPassword === 'string' ? input.currentPassword : '';
      const newPassword = typeof input.newPassword === 'string' ? input.newPassword : '';
      const actual = Buffer.from(await scrypt(currentPassword.slice(0, 128), user.salt, PASSWORD_BYTES, PASSWORD_OPTIONS));
      const expected = Buffer.from(user.passwordHash, 'hex');
      if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new HttpError(403, 'Le mot de passe actuel est incorrect.');
      if (newPassword.length < 10 || newPassword.length > 128 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        throw new HttpError(400, 'Le nouveau mot de passe doit contenir 10 à 128 caractères, une majuscule, une minuscule et un chiffre.');
      }
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = Buffer.from(await scrypt(newPassword, salt, PASSWORD_BYTES, PASSWORD_OPTIONS)).toString('hex');
      await repository.updateUser(user.id, { salt, passwordHash });
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
      checkOrigin(request);
      const cookies = (request.headers.cookie || '').split(';').map(item => item.trim());
      const cookie = cookies.find(item => item.startsWith('bloxforge_session='));
      const token = cookie && cookie.slice('bloxforge_session='.length);
      if (token && /^[a-f0-9]{64}$/.test(token)) {
        sessions.delete(crypto.createHash('sha256').update(token).digest('hex'));
      }
      clearSessionCookie(response);
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/api/onboarding') {
      checkOrigin(request);
      const user = sessionUser(request);
      if (!user) throw new HttpError(401, 'Veuillez vous connecter pour continuer.');
      if (user.onboarding) throw new HttpError(409, 'Le questionnaire a déjà été enregistré.');
      const input = await readJson(request);
      const whyBloxforge = typeof input.whyBloxforge === 'string' ? input.whyBloxforge.trim() : '';
      const attributionName = typeof input.attributionName === 'string' ? input.attributionName.trim() : '';
      if (!DISCOVERY_SOURCES.has(input.discovery) || !['consumer', 'creator'].includes(input.role) ||
          whyBloxforge.length < 3 || whyBloxforge.length > 500 || attributionName.length > 120 ||
          (['youtube', 'social', 'friend'].includes(input.discovery) && attributionName.length < 2)) {
        throw new HttpError(400, 'Complétez le questionnaire et choisissez un mode.');
      }
      const updated = await repository.updateUser(user.id, {
        role: input.role,
        onboarding: {
          discovery: input.discovery,
          attributionName: attributionName || null,
          whyBloxforge,
          completedAt: new Date().toISOString()
        }
      });
      return sendJson(response, 200, { user: publicUser(updated) });
    }

    if (request.method === 'POST' && url.pathname === '/api/profile/role') {
      checkOrigin(request);
      const user = requireUser(request);
      const input = await readJson(request);
      if (input.role !== 'creator') throw new HttpError(400, 'Le seul changement possible est consommateur vers créateur.');
      if (user.role !== 'consumer') throw new HttpError(409, 'Le mode créateur ne peut pas être annulé.');
      const updated = await repository.updateUser(user.id, { role: 'creator' });
      return sendJson(response, 200, { user: publicUser(updated) });
    }

    if (url.pathname === '/api/courses' && request.method === 'GET') {
      const user = requireUser(request);
      const courses = repository.listCourses().map(course => {
        const owner = repository.findUserById(course.ownerId);
        return {
          id: course.id, ownerId: course.ownerId, creatorName: owner ? owner.name : 'Créateur',
          title: course.title, description: course.description, price: course.price,
          lessons: course.lessons, document: course.document, version: course.version || 1, status: course.status || 'published', createdAt: course.createdAt, updatedAt: course.updatedAt
        };
      });
      return sendJson(response, 200, { courses, currentUserId: user.id });
    }

    if (url.pathname === '/api/courses' && request.method === 'POST') {
      checkOrigin(request);
      const user = requireUser(request);
      requireCreator(user);
      const fields = validateCourse(await readJson(request));
      const { expectedVersion, ...createFields } = fields;
      const now = new Date().toISOString();
      const course = {
        id: crypto.randomUUID(), ownerId: user.id, ...createFields, version: 1, status: 'draft',
        createdAt: now, updatedAt: now
      };
      await repository.createCourse(course);
      return sendJson(response, 201, { course });
    }

    const courseMatch = url.pathname.match(/^\/api\/courses\/([a-f0-9-]{36})$/);
    if (courseMatch && request.method === 'PUT') {
      checkOrigin(request);
      const user = requireUser(request);
      requireCreator(user);
      const fields = validateCourse(await readJson(request));
      const course = await repository.updateCourse(courseMatch[1], user.id, fields);
      return sendJson(response, 200, { course });
    }
    if (courseMatch && request.method === 'DELETE') {
      checkOrigin(request);
      const user = requireUser(request);
      requireCreator(user);
      await repository.deleteCourse(courseMatch[1], user.id);
      return sendJson(response, 200, { ok: true });
    }

    throw new HttpError(404, 'Route introuvable.');
  }

  async function routeStatic(request, response, url) {
    if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Méthode non autorisée.');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch {
      throw new HttpError(400, 'Chemin invalide.');
    }
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT, relativePath);
    if (!filePath.startsWith(ROOT + path.sep)) throw new HttpError(404, 'Fichier introuvable.');
    const relative = path.relative(ROOT, filePath).toLowerCase();
    const allowedRootFiles = new Set(['index.html', 'style.css', 'script.js', 'auth-client.js']);
    if (!allowedRootFiles.has(relative) &&
        !relative.startsWith('assets' + path.sep) &&
        !relative.startsWith('images pour bloxforge' + path.sep)) {
      throw new HttpError(404, 'Fichier introuvable.');
    }
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.webp': 'image/webp'
    };
    if (!mimeTypes[extension]) throw new HttpError(404, 'Fichier introuvable.');
    let content;
    try { content = await fs.readFile(filePath); } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR') throw new HttpError(404, 'Fichier introuvable.');
      throw error;
    }
    headers(response);
    response.writeHead(200, { 'Content-Type': mimeTypes[extension], 'Content-Length': content.length });
    response.end(request.method === 'HEAD' ? undefined : content);
  }

  const server = http.createServer(async (request, response) => {
    try {
      await ready;
      const url = new URL(request.url, 'http://127.0.0.1:' + port);
      if (url.pathname.startsWith('/api/')) return await routeApi(request, response, url);
      return await routeStatic(request, response, url);
    } catch (error) {
      if (error instanceof HttpError) return sendJson(response, error.status, { error: error.message });
      console.error('Local BLOXFORGE server request failed:', error.message);
      return sendJson(response, 500, { error: 'Erreur interne du serveur.' });
    }
  });

  return { server, ready, repository, port };
}

if (require.main === module) {
  const app = createAppServer();
  app.server.listen(app.port, '127.0.0.1', () => {
    console.log('BLOXFORGE local: http://127.0.0.1:' + app.port);
    console.log('Comptes de test locaux uniquement. N’utilisez pas de vrais mots de passe ou données sensibles.');
  });
  app.server.on('error', error => {
    console.error('Impossible de démarrer le serveur local:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { createAppServer, createLocalRepository, validateCourse, validateCourseDocument, migrateLegacyCourse, HttpError };
