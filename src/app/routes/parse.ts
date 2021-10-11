import { Router, Response, NextFunction } from 'express';

import { IGrabber } from '../../core/types';

const PRODUCT_PAGE_URL = 'https://www.dns-shop.ru/product/8c6be93915daed20/61-smartfon-apple-iphone-13-pro-1000-gb-goluboj/';

export function parse(grabber: IGrabber) {
  const router = Router();

  router.get('/parse', async (_: unknown, res: Response, next: NextFunction) => {
    try {
      res.json(await grabber.grabFrom(PRODUCT_PAGE_URL));
    } catch(err) {
      next(err);
    }
  });

  return router;
}
