/* eslint-disable
    @typescript-eslint/no-explicit-any,
    no-console,
    no-empty,
  */

import puppeteer from 'puppeteer';
import { expect } from 'chai';
import 'mocha';

let browser: any;
let page: any;

describe('Asserts that we can access a headless browser', () => {
  before(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  it('gets the dimensions of the browser ', async () => {
    /* due to this issue https://github.com/GoogleChrome/puppeteer/issues/1054,
     * the istanbul (coverage reporter) will cause error inside page.evaluate throwing exception.
     * the following "ignore" comment allows istanbul to succeed */
    /* istanbul ignore next */
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
    // 800 is the default browser width when constructing a new page
    expect(dimensions.width).to.equal(800);
  });

  after(async () => {
    await browser.close();
  });
});
