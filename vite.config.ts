import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import gamesHandler from './api/games';
import notebooksHandler from './api/notebooks';

function apiMiddlewarePlugin() {
  const mountApi = (server: any) => {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url = req.url ? req.url.split('?')[0] : '';
      if (url === '/api/games' || url === '/api/notebooks') {
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify(data));
          return res;
        };

        const handler = url === '/api/games' ? gamesHandler : notebooksHandler;

        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk.toString();
          });
          req.on('end', async () => {
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            try {
              await handler(req, res);
            } catch (err: any) {
              if (!res.writableEnded) {
                res.status(500).json({ error: err?.message || 'Server error' });
              }
            }
          });
        } else {
          try {
            await handler(req, res);
          } catch (err: any) {
            if (!res.writableEnded) {
              res.status(500).json({ error: err?.message || 'Server error' });
            }
          }
        }
      } else {
        next();
      }
    });
  };

  return {
    name: 'api-serverless-plugin',
    configureServer(server: any) {
      mountApi(server);
    },
    configurePreviewServer(server: any) {
      mountApi(server);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
    },
  };
});
