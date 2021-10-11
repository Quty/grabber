import {
  Browser,
  ICompetitorInfoGrabberFactory,
  CompetitorInfoGrabberConstructor,
  GrabberOptions,
  ICompetitorInfoGrabber,
} from './types';

export class CompetitorInfoGrabberFactory implements ICompetitorInfoGrabberFactory {
  constructor(
    private readonly browser: Browser,
    private readonly grabberConstructors: CompetitorInfoGrabberConstructor[],
    private readonly options: GrabberOptions = {},
  ) {}

  async createGrabberForUrl(url: string): Promise<ICompetitorInfoGrabber> {
    const grabberCtr = this.grabberConstructors.find((ctr) => ctr.isMatchUrl(url));

    if (!grabberCtr) {
      throw new Error(`Unable to find grabber for ${url}`);
    }

    return new grabberCtr(this.browser, url, this.options);
  }
}
