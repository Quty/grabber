import { ICompetitorInfoGrabber } from './competitor-info-grabber';

export interface ICompetitorInfoGrabberFactory {
  createGrabberForUrl(url: string): Promise<ICompetitorInfoGrabber>;
}
