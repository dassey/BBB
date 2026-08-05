#!/usr/bin/env node
/**
 * Zero-dependency static server for local preview.
 *
 *   node .agent/tools/serve.mjs [--port=8080]
 *
 * Opening index.html straight off disk mostly works, but file:// URLs break
 * root-relative paths and make the language toggle's localStorage behave
 * differently from production. Serve over HTTP when you need to trust what
 * you are looking at.
 *
 * Also exported as startServer() so snapshot.mjs can drive a real browser
 * against the same code path.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

export function startServer(port = 0) {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (path.endsWith('/')) path += 'index.html';

      // Never serve the agent's own workspace or git internals.
      const rel = normalize(path).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
      if (rel.startsWith('.git') || rel.startsWith('.agent') || rel.startsWith('.claude')) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const file = join(ROOT, rel);
      if (!file.startsWith(ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const info = await stat(file);
      if (info.isDirectory()) {
        res.writeHead(302, { Location: path.replace(/\/?$/, '/') + 'index.html' }).end();
        return;
      }

      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({ server, port: server.address().port, root: ROOT });
    });
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const portArg = process.argv.find((a) => a.startsWith('--port='));
  const port = Number(portArg ? portArg.slice(7) : process.env.PORT || 8080);
  const { port: actual } = await startServer(port);
  console.log(`Northland Driving — serving ${ROOT}`);
  console.log(`  http://localhost:${actual}/`);
  console.log('  Ctrl-C to stop.');
}
