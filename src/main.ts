import Puppeteer from 'puppeteer';

import { createApp } from './app';
import { config } from './config';
import { createLogger } from './logger';
import { competitorGrabbers, CompetitorInfoGrabberFactory, Grabber } from './core';

const logger = createLogger();

async function bootstrap() {
  const browser = await Puppeteer.launch({ headless: false });
  const competitorInfoGrabberFactory = new CompetitorInfoGrabberFactory(browser, competitorGrabbers, { timeout: 5000 });
  const grabber = new Grabber(competitorInfoGrabberFactory);

  const app = createApp({
    grabber,
    logger,
  });

  const server = app.listen(config.port, () => {
    logger.log(`Server listening on ${config.port} port`);
  });

  server.on('close', async () => {
    if (browser.isConnected()) {
      browser.removeAllListeners();
      await browser.close();
    }

    logger.log('Application stoped');
  });

  const gracefullyShutdown = (signal: NodeJS.Signals) => {
    logger.log(`Got ${signal} signal. Shutting down application...`);
    server.close();
  };

  const gracefullyShutdownSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGKILL', 'SIGINT'];
  gracefullyShutdownSignals.forEach((signal) => process.on(signal, gracefullyShutdown));
}

bootstrap().catch((err) => logger.error(err));
