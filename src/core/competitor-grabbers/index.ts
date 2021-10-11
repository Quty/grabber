import { CompetitorInfoGrabberConstructor } from '../types';
import { DnsGrabber } from './dns-grabber';

export * from './dns-grabber';

export const competitorGrabbers: CompetitorInfoGrabberConstructor[] = [DnsGrabber];
