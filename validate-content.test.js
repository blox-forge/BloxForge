const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const root = __dirname;
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const curriculumSource = fs.readFileSync(path.join(root, 'archive', 'default-courses', 'curriculum.js'), 'utf8');
const originalScript = fs.readFileSync(path.join(root, 'archive', 'default-courses', 'restore-original-script.js'), 'utf8');
const curriculumContext = { window: {} };
vm.runInNewContext(curriculumSource, curriculumContext);
const curriculum = JSON.parse(JSON.stringify(curriculumContext.window.BLOXFORGE_ARCHIVED_CURRICULUM));
const { LESSONS, GAME_TYPES, COURSE_META, LEARNING_PATHS, FINAL_PROJECTS } = curriculum;
const ids = (source, expression) => [...source.matchAll(expression)].map(match => match[1]);
const section = (source, start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.notEqual(from, -1, `Missing section: ${start}`);
  assert.notEqual(to, -1, `Missing end marker: ${end}`);
  return source.slice(from, to);
};

test('the archived curriculum keeps all 11 courses, lessons, metadata, and projects', () => {
  const lessonIds = LESSONS.map(lesson => lesson.id);
  const gameIds = GAME_TYPES.map(game => game.id);

  assert.equal(gameIds.length, 11);
  assert.equal(new Set(gameIds).size, gameIds.length);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  for (const course of GAME_TYPES) {
    assert.ok(lessonIds.includes(course.lesson), `${course.id} points to missing lesson ${course.lesson}`);
    assert.ok(COURSE_META[course.id], `${course.id} has no catalog metadata`);
    assert.ok(FINAL_PROJECTS[course.id], `${course.id} has no final project`);
  }
});

test('archived course images and learning-path references still exist', () => {
  for (const course of GAME_TYPES) {
    const imagePath = path.join(root, decodeURIComponent(course.img.replace(/^\.\//, '')));
    assert.ok(fs.existsSync(imagePath), `${course.id} image does not exist: ${course.img}`);
  }
  for (const route of LEARNING_PATHS) {
    for (const id of route.courses) assert.ok(GAME_TYPES.some(course => course.id === id), `Unknown course ${id}`);
  }
});

test('archived courses retain lesson steps and practice missions', () => {
  for (const course of GAME_TYPES) {
    const lesson = LESSONS.find(item => item.id === course.id);
    assert.ok(lesson, `Missing lesson content for ${course.id}`);
    assert.ok(lesson.steps.length > 0, `${course.id} has no lesson steps`);
    assert.ok(lesson.exos.length > 0, `${course.id} has no practice missions`);
  }
});

test('the active home contains only community courses and their search', () => {
  const home = section(script, 'function buildHome(){', 'function setupCourseCreator(v){');
  const catalog = section(script, 'function setupCatalog(v){', '/* ---------- LEÇON / MASTERCLASS ---------- */');

  assert.match(html, /<div id="app"><\/div>/);
  assert.doesNotMatch(html, /Onze types de jeux|11 MASTERCLASS|Parcours Premier jeu/);
  assert.match(script, /const LESSONS=archivedCurriculum\.LESSONS\|\|\[\]/);
  assert.match(script, /const GAME_TYPES=archivedCurriculum\.GAME_TYPES\|\|\[\]/);
  assert.match(originalScript, /const LESSONS=\[/);
  assert.match(originalScript, /Parcours Premier jeu/);
  assert.match(home, /const courseCards=customCourses\.map/);
  assert.match(home, /id="courseSearch"/);
  assert.doesNotMatch(home, /path-grid|path-card|data-route|class="gt|PROGRESSION GUIDÉE|MASTERCLASS/);
  assert.match(catalog, /querySelectorAll\('\.creator-card'\)/);
  assert.match(catalog, /card\.textContent\.toLocaleLowerCase\(\)\.includes\(query\)/);
  assert.doesNotMatch(catalog, /data-route|diagnosePath|filterGenre|filterLevel/);
});

test('local progress remains intact while the built-in curriculum is archived', () => {
  const normalizer = section(script, 'function normalizeProgress(raw){', '\ntry{state=normalizeProgress(state);');
  const context = {
    DEFAULT_STATE: { done: [], ex: {}, eval: {}, xp: 0, last: null, lastLesson: null, lastStep: {}, projects: {}, kuboMuted: false },
    LESSONS: [],
    GAME_TYPES: [],
    L_by: () => null
  };
  vm.runInNewContext(normalizer + '\nglobalThis.normalizeProgress=normalizeProgress;', context);

  const previousProgress = {
    done: ['pre', 'obby'],
    ex: { 'obby-e0': true },
    eval: { obby: { best: 80, passed: true } },
    xp: 650,
    last: { type: 'lesson', id: 'obby' },
    lastLesson: 'obby',
    lastStep: { obby: 4 },
    projects: { obby: { 0: true } },
    kuboMuted: true
  };
  const preserved = JSON.parse(JSON.stringify(context.normalizeProgress(previousProgress)));

  assert.deepEqual(preserved.done, previousProgress.done);
  assert.deepEqual(preserved.ex, previousProgress.ex);
  assert.deepEqual(preserved.eval, previousProgress.eval);
  assert.equal(preserved.xp, previousProgress.xp);
  assert.deepEqual(preserved.last, previousProgress.last);
  assert.deepEqual(preserved.lastStep, previousProgress.lastStep);
  assert.deepEqual(preserved.projects, previousProgress.projects);
  assert.equal(preserved.kuboMuted, true);
});
