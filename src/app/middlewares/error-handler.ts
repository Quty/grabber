import { Response, NextFunction } from 'express';

import { Logger } from '../../core/types';

export function errorHandler(logger: Logger) {
  return function (err: unknown, _: unknown, res: Response, next: NextFunction) {
    logger.error('Error:', err);
    res.status(500).send();
  }
}
