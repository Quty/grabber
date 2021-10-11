import { IGrabber, Logger } from '../../core/types';

export interface AppDependencies {
  grabber: IGrabber;
  logger: Logger;
}
