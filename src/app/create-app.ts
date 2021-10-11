import express from 'express';

import { AppDependencies } from './types';
import { parse } from './routes';
import { errorHandler } from './middlewares';

export function createApp(dependencies: AppDependencies) {
  const app = express();
  const parseRouter = parse(dependencies.grabber);

  app.use('/', parseRouter);
  app.use(errorHandler(dependencies.logger));

  return app;
}
