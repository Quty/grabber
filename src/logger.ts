import { Console } from 'console';

import { Logger } from './core/types';

export function createLogger(): Logger {
  const console = new Console(process.stdout, process.stderr, false);

  return {
    log(...args) {
      console.log(`${new Date().toISOString()}:`, ...args);
    },
    error(...args) {
      console.error(`${new Date().toISOString()}:`, ...args);
    },
  };
}
