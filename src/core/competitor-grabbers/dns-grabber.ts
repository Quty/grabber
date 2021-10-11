import Puppeteer from 'puppeteer';

import { waitForStabilization } from '../../utils';
import { ICompetitorInfoGrabber, Browser, GrabberOptions } from '../types';

export class DnsGrabber implements ICompetitorInfoGrabber {
  private static readonly urlRegExp = /^(https?:\/\/)?(www\.)?dns-shop\.ru/;

  private static readonly priceSelector = '.product-card-top.product-card-top_full .product-buy__price';

  private static readonly showShopsButtonSelector = '.order-avail-wrap:not(.order-avail-wrap_postamat) .order-avail-wrap__link';

  private static readonly shopsListSelector = '.base-shop-choose-list.vue-shop-avail__shops-list';

  private static readonly extractPrice = (priceNode: Element) => priceNode.firstChild?.textContent;

  private static readonly extractShopTitles = (shopsListNode: Element) => [...shopsListNode.children]
    .filter((shopNode) => shopNode.querySelector('.base-shop-view__issue-date:not(.base-shop-view__issue-date_gray)'))
    .map((shopNode) => shopNode.querySelector('.base-shop-view__title'))
    .filter((shopTitleNode): shopTitleNode is Element => !!shopTitleNode)
    .map((shopTitleNode) => shopTitleNode.textContent)
    .filter((shopTitle): shopTitle is string => shopTitle !== null);

  constructor(
    private readonly browser: Browser,
    private readonly url: string,
    private readonly options: GrabberOptions,
  ) {}

  async getPrice(): Promise<number> {
    const page = await this.browser.newPage();

    if (this.options.timeout !== undefined) {
      page.setDefaultTimeout(this.options.timeout);
    }

    try {
      await page.goto(this.url);
      const priceElement = await page.waitForSelector(DnsGrabber.priceSelector);

      if (!priceElement) {
        throw new Error(`Unable to get price element by selector '${DnsGrabber.priceSelector}'`);
      }

      const priceStr = await page.evaluate(DnsGrabber.extractPrice, priceElement);

      if (!priceStr) {
        throw new Error(`Unable to extract price from selected element`);
      }

      return Math.floor(this.parsePrice(priceStr));
    } catch (err) {
      throw new Error(`Unable to get price from ${this.url}: ${err}`);
    } finally {
      await page.close();
    }
  }

  async getShopsWithProductInStock(): Promise<string[]> {
    const page = await this.browser.newPage();

    if (this.options.timeout !== undefined) {
      page.setDefaultTimeout(this.options.timeout);
    }

    try {
      await page.goto(this.url);
      let showShopsButton: Puppeteer.ElementHandle<Element> | null = null;

      try {
        showShopsButton = await page.waitForSelector(DnsGrabber.showShopsButtonSelector);
      } catch {}

      // Если выше в итоге не был найден элемент, нажатие на который открывает список магазинов,
      // то это означает, что нет ни одного магазина и следует вернуть пустой список.
      if (!showShopsButton) {
        return [];
      }

      await showShopsButton.click();

      const shopsListNode = await page.waitForSelector(DnsGrabber.shopsListSelector);

      if (!shopsListNode) {
        throw new Error('Unable to find shops list after click "show shops" button');
      }

      // Т.к. список магазинов подгружается постранично, нужно некоторое время на его загрузку.
      // Для этого раз в заданный промежуток проверяется, была ли за прошедшее время подгружена
      // новая порция. Если да -- процесс повторяется, если нет -- считается, что весь список
      // загружен и продолжается выполнение функции.
      await waitForStabilization(
        () => page.evaluate((el) => el.childElementCount, shopsListNode),
        (v1, v2) => v1 === v2,
        3000,
        10000,
      );

      return page.evaluate(DnsGrabber.extractShopTitles, shopsListNode);
    } catch (err) {
      throw new Error(`Unable to get shops with product in stock from ${this.url}: ${err}`);
    } finally {
      await page.close();
    }
  }

  private parsePrice(price: string): number {
    const sanitizedPrice = price.replace(/[\s₽]/g, '');
    const parsedPrice = parseFloat(sanitizedPrice);

    if (isNaN(Number(sanitizedPrice)) || isNaN(parsedPrice)) {
      throw new Error(`Incorrect price ${price}`);
    }

    return parsedPrice;
  }

  static isMatchUrl(url: string): boolean {
    return this.urlRegExp.test(url);
  }
}
