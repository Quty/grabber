import { Browser } from './browser';
import { GrabberOptions } from './grabber-options';
import { ICompetitorInfoGrabber } from './competitor-info-grabber';

export interface CompetitorInfoGrabberConstructor {
  new(browser: Browser, url: string, options: GrabberOptions): ICompetitorInfoGrabber;
  isMatchUrl(url: string): boolean;
}
