import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('authenticated requests work without native WebSocket on the Replit runtime', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { request } from 'node:http';
    import { once } from 'node:events';
    // Node 20 has no native global WebSocket. Only the remote auth boundary is mocked.
    globalThis.WebSocket = undefined;
    process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:9';
    process.env.VITE_SUPABASE_ANON_KEY = 'test-only-not-a-secret';
    let authCalls = 0;
    globalThis.fetch = async (url) => {
      assert.equal(String(url), 'http://127.0.0.1:9/auth/v1/user');
      authCalls++;
      return Response.json({ id: 'test-user', aud: 'authenticated' });
    };
    const { default: app } = await import('./api/index.js');
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const response = await new Promise((resolve, reject) => {
        const req = request({ host: '127.0.0.1', port: server.address().port,
          path: '/api/send-treatment-plan', method: 'POST', headers: {
            Authorization: 'Bearer test-session', 'Content-Type': 'application/json'
          } }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
          });
        req.on('error', reject);
        // Auth succeeds; validation exits before any SMS, email or database access.
        req.end(JSON.stringify({ deliveryMethod: 'invalid' }));
      });
      assert.equal(response.status, 400);
      assert.match(response.body.error, /Invalid deliveryMethod/);
      assert.equal(authCalls, 1);
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  `], {
    cwd: new URL('../', import.meta.url),
    env: { PATH: process.env.PATH, DOTENV_CONFIG_PATH: '/dev/null' },
    timeout: 10000,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
});

test('function entrypoint imports the shared app without starting a server', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import handler from './api/index.js';
    import app from './server/app.js';
    assert.equal(handler, app);
    assert.equal(typeof handler, 'function');
  `], {
    cwd: new URL('../', import.meta.url),
    env: { PATH: process.env.PATH, DOTENV_CONFIG_PATH: '/dev/null' },
    timeout: 10000,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
});

// A fresh process receives no Supabase, SMTP, Twilio or dotenv credentials.
test('local server preserves API authentication and the pre-HTML patient handoff', async (t) => {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server/index.js'], {
    cwd: new URL('../', import.meta.url),
    env: { PATH: process.env.PATH, NODE_ENV: 'production', PORT: String(port), DOTENV_CONFIG_PATH: '/dev/null' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill();
      await once(child, 'exit');
    }
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10000);
    child.stdout.on('data', chunk => {
      if (chunk.toString().includes('[Server] Running')) { clearTimeout(timer); resolve(); }
    });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)); });
  });
  const origin = `http://127.0.0.1:${port}`;
  for (const [method, path] of [
    ['POST', '/api/notifications/send'], ['POST', '/api/send-treatment-plan'],
    ['GET', '/api/message-logs/test-plan'], ['POST', '/api/test-sms'],
  ]) {
    const response = await fetch(origin + path, { method });
    assert.equal(response.status, 401, path);
    assert.deepEqual(await response.json(), { ok: false, error: 'Authentication required' });
  }
  const response = await fetch(`${origin}/p/test_token-123`, { redirect: 'manual', headers: { 'x-forwarded-proto': 'https' } });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), '/p');
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /chairiq_plan_token=test_token-123/);
  assert.match(cookie, /Max-Age=300/);
  assert.match(cookie, /Path=\/p(?:;|$)/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /; Secure/);
  assert.doesNotMatch(cookie, /HttpOnly/);
  assert.match(response.headers.get('cache-control') || '', /no-store/);

  const http = await fetch(`${origin}/p/test_token-123`, { redirect: 'manual' });
  assert.doesNotMatch(http.headers.get('set-cookie'), /; Secure/);
  for (const token of ['short', 'invalid.token', 'a'.repeat(129)]) {
    const invalid = await fetch(`${origin}/p/${token}`, { redirect: 'manual' });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.headers.get('set-cookie'), null);
    assert.match(invalid.headers.get('cache-control') || '', /no-store/);
  }
  for (const path of ['/api/missing', '/api', '/api/missing/deep']) {
    const missing = await fetch(origin + path);
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get('content-type'), /application\/json/);
  }
  await t.test('built frontend deep links and assets are served locally', {
    skip: !existsSync(new URL('../build/index.html', import.meta.url)) && 'Run npm run build first',
  }, async () => {
    const html = readFileSync(new URL('../build/index.html', import.meta.url), 'utf8');
    for (const path of ['/p', '/consent', '/admin-home-dashboard']) {
      const page = await fetch(origin + path);
      assert.equal(page.status, 200);
      assert.equal(await page.text(), html);
    }
    const asset = html.match(/src="(\/assets\/[^\"]+\.js)"/)[1];
    const response = await fetch(origin + asset);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /javascript/);
    assert.doesNotMatch(await response.text(), /<!doctype html>/i);
  });
});
