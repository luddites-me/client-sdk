/* eslint-disable
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unused-vars,
    no-console,
    no-empty,
    no-unused-vars,
  */
/* global ProtectJSSDK */
import puppeteer from 'puppeteer';
import { expect } from 'chai';
import 'mocha';

let browser: any;
let page: any;

// We need to inform the compiler that ProtectJSSDK is a global variable
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
    // This is the only way to accurately pass the SDK methods from the node context,
    // which is the context in which the tests are running and the browser context,
    // which is what executes inside page.evaluate
    await page.addScriptTag({ path: './dist/protect.js' });
    await page.addScriptTag({ path: './node_modules/postmate/build/postmate.min.js' });
    /* istanbul ignore next */
    const dimensions = await page.evaluate(async () => {
      const body: HTMLBodyElement | null = document.querySelector('body');
      if (!body) throw new Error('Document body was not found');

      const container: HTMLDivElement = document.createElement('div');
      container.id = 'ns8-protect-wrapper';
      body.appendChild(container);

      const protectClient = new Protect.Client({
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
      // At this point, the test should probably assert a does-not-throw,
      // as that is all this test currently accomplishes
      return { width: document.documentElement.clientWidth };
    });
    // We don't have a more sophisticated assertion for this test yet
    expect(dimensions.width).to.equal(800);
  });

  after(async () => {
    await browser.close();
  });
});
