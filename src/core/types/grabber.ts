import { CompetitorInfo } from './competitor-info';

export interface IGrabber {
  grabFrom(url: string): Promise<CompetitorInfo>;
}
