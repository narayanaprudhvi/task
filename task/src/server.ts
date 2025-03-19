import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import * as path from 'path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_BASE_HREF } from '@angular/common';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const distFolder = path.join(process.cwd(), 'dist/browser');
const indexHtml = path.join(distFolder, 'index.html');
const angularApp = new AngularNodeAppEngine();

const getPrerenderParams = () => {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
};

// SSR render route with prerendering params
app.get('/students/edit/:id', (req, res) => {
  const params = getPrerenderParams();

  const paramId = req.params.id;
  const matchingParam = params.find(p => p.id === paramId);

  if (matchingParam) {
    res.render(indexHtml, {
      req,
      res,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
      ]
    });
  } else {
    res.status(404).send('Not Found');
  }
});

app.get('*', (req, res) => {
  res.render(indexHtml, { req, res });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});


/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
