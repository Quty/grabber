export interface ICompetitorInfoGrabber {
  getPrice(): Promise<number>;
  getShopsWithProductInStock(): Promise<string[]>;
}
