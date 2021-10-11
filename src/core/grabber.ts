import { IGrabber, ICompetitorInfoGrabberFactory, CompetitorInfo } from './types';

export class Grabber implements IGrabber {
  constructor(
    private readonly grabberFactory: ICompetitorInfoGrabberFactory
  ) {}

  async grabFrom(url: string): Promise<CompetitorInfo> {
    const competitroGrabber = await this.grabberFactory.createGrabberForUrl(url);
    const price = await competitroGrabber.getPrice();
    const shopsWithProductInStock = await competitroGrabber.getShopsWithProductInStock();

    return {
      price,
      shopsWithProductInStock,
    };
  }
}
