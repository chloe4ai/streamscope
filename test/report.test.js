// Tests for the mock-data layer (data.js + api.js). Browser globals, so they are
// loaded into a vm context rather than required:  node --test test/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('node:vm');

const js = (f) => fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', f), 'utf8');
const ctx = vm.createContext({ console, fetch: async () => { throw new Error('no network in tests'); } });
vm.runInContext(js('data.js') + '\n' + js('api.js'), ctx);
const { getShowUrl, generateMockReport, api, MOCK_VIEWING_HISTORY, MOCK_USER } = ctx;

test('report carries the fields the reports view reads', () => {
  const r = generateMockReport('weekly');
  for (const k of ['user_id', 'period', 'start_date', 'end_date', 'total_watch_time_minutes',
                   'total_episodes', 'top_categories', 'top_actors', 'top_directors',
                   'platform_breakdown', 'peak_hours', 'binge_sessions']) {
    assert.ok(k in r, `missing ${k}`);
  }
  assert.equal(r.period, 'weekly');
  assert.ok(!Number.isNaN(Date.parse(r.start_date)));
  assert.ok(!Number.isNaN(Date.parse(r.end_date)));
});

test('app.js must not define its own generateMockReport', () => {
  // app.js loads after api.js, so a second definition silently shadows this one —
  // that copy returned no dates and the report header rendered "Invalid Date".
  const app = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'js', 'app.js'), 'utf8');
  assert.ok(!/function\s+generateMockReport\s*\(/.test(app));
});

test('an empty period returns a zeroed report, not a crash', () => {
  const r = generateMockReport('weekly', []);
  assert.equal(r.total_episodes, 0);
  assert.equal(r.total_watch_time_minutes, 0);
  assert.deepEqual(r.top_categories, []);
  assert.equal(r.user_id, MOCK_USER.id);
  assert.ok(!Number.isNaN(Date.parse(r.start_date)));
});

test('the report reads the history it is given', () => {
  const one = [{ title: 'X', platform: 'netflix', category: 'Drama', actors: ['A'], director: 'D',
                 watch_duration_minutes: 90, completed: true, watched_at: new Date().toISOString() }];
  const r = generateMockReport('weekly', one);
  assert.equal(r.total_episodes, 1);
  assert.equal(r.total_watch_time_minutes, 90);
  assert.equal(r.top_categories[0].percentage, 100);
});

test('period windows nest', () => {
  const w = generateMockReport('weekly').total_episodes;
  const m = generateMockReport('monthly').total_episodes;
  const a = generateMockReport('all').total_episodes;
  assert.ok(w <= m && m <= a);
});

test('category percentages sum to ~100', () => {
  const sum = generateMockReport('monthly').top_categories.reduce((t, c) => t + c.percentage, 0);
  assert.ok(Math.abs(sum - 100) < 1.5, `sum=${sum}`);
});

test('getShowUrl: known title, and an unknown platform does not throw', () => {
  assert.equal(getShowUrl('Dark', 'netflix'), 'https://www.netflix.com/title/80238110');
  assert.ok(getShowUrl('Whatever', 'netflix').startsWith('https://www.netflix.com/search?q='));
  assert.ok(getShowUrl('Whatever', 'peacock').includes('Whatever'));
});

test('addEntry keeps the given timestamp and stores a numeric duration', async () => {
  const when = new Date(Date.now() - 5 * 86400000).toISOString();
  const e = await api.addEntry(MOCK_USER.id, {
    title: 'Test', platform: 'netflix', category: 'Drama', actors: ['A'], director: 'D',
    watch_duration_minutes: '45', completed: true, watched_at: when,
  });
  assert.equal(e.watched_at, when);
  assert.equal(e.watch_duration_minutes, 45);
  assert.equal(MOCK_VIEWING_HISTORY[0].id, e.id);
});
