import app from './app.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function start() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || process.env.REPLIT_DEPLOYMENT === '1';

  if (isProduction) {
    // Serve the pre-built SPA (vite build output) — no Vite dev server in production.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const buildDir = path.resolve(__dirname, '..', 'build');
    app.use(express.static(buildDir));
    // SPA fallback for deep links like /consent (but not /api/*).
    app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(buildDir, 'index.html'));
    });
    console.log(`[Server] Production mode: serving static files from ${buildDir}`);
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
