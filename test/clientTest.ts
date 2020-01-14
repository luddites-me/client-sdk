/* eslint-disable
    @typescript-eslint/no-explicit-any,
    no-console,
    no-empty,
  */
/* global ProtectJSSDK */
import puppeteer from 'puppeteer';
import { expect } from 'chai';
import 'mocha';

let browser: any;
let page: any;

declare let ProtectJSSDK: any;

describe('Asserts that we can access a headless browser', () => {
  before(async () => {
    /*
      For debugging, set the following options:
        devtools: true,
        headless: false,
    */
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  it('gets the dimensions of the browser ', async () => {
    /* due to this issue https://github.com/GoogleChrome/puppeteer/issues/1054,
     * the istanbul (coverage reporter) will cause error inside page.evaluate throwing exception.
     * the following "ignore" comment allows istanbul to succeed */
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
    });
    /* istanbul ignore next */
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
    expect(dimensions.width).to.equal(800);
  });

  it('inserts an iframe using the Client ', async () => {
    await page.addScriptTag({ path: './dist/index.js' });
    await page.addScriptTag({ path: './node_modules/postmate/build/postmate.min.js' });
    /* istanbul ignore next */
    const dimensions = await page.evaluate(async () => {
      const body: HTMLBodyElement | null = document.querySelector('body');
      if (!body) throw new Error('Document body was not found');

      const container: HTMLDivElement = document.createElement('div');
      container.id = 'ns8-protect-wrapper';
      body.appendChild(container);

      const protectClient = new ProtectJSSDK.Client({
        api: {
          clientApi: 'http://example.com',
          platformOrderBaseUrl: '/sales/order/view/order_id/',
        },
        page: {
          classNames: ['ns8-protect-client-iframe'],
          clientContainerId: 'ns8-protect-wrapper',
          clientHeight: 'calc(100vh - 100px - 20px)',
          clientPaddingTop: 419,
          orderContainerId: 'sales_order_view_tabs_ns8_protect_order_review_content',
        },
      });
      protectClient.render();

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
