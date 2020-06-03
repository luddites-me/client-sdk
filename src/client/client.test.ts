/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, use } from 'chai';
import { JSDOM } from 'jsdom';

import 'mocha';
import { ClientConfig, ClientPage, EventName, createClient } from '..';
import { forTest } from './client';

import chaiAsPromised = require('chai-as-promised');

/**
 * Global reference space to define NodeJS in test context
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      document: {};
      window: {};
    }
  }
}

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const clientDomId = 'ns8-protect-client-iframe';
const clientClassName = 'ns8-protect-client-iframe';
const getConfig = (config?: object): ClientConfig =>
  new ClientConfig({
    accessToken: uuid,
    eventBinding: {
      [EventName.NS8_PROTECT_CLIENT_CONNECTED]: (): Promise<any> => Promise.resolve(),
    },
    iFrameConfig: {
      classNames: [clientClassName],
      attachToId: clientDomId,
    },
    ...config,
  });

/**
 * Initializes a virtual window/document object using JSDOM
 */
const initVirtualDom = (): JSDOM => {
  const jsdom = new JSDOM(`<!DOCTYPE html><div id="${clientDomId}" class="${clientClassName}"></div>`);
  global.document = jsdom.window.document;
  global.window = jsdom.window;
  return jsdom;
};

/**
 * Tests that cover the implementation of the Client
 */
describe('Asserts that we can manipulate an iframe through the Client', () => {
  use(chaiAsPromised);

  beforeEach(() => {
    ClientConfig.DEBUG = true;
    initVirtualDom();
  });

  it('triggers a "ready" method without error ', async () => {
    const config = getConfig();
    const client = createClient(config);
    // The `ready` method is defined and will not throw
    expect(() => client.trigger(EventName.NS8_PROTECT_CLIENT_CONNECTED)).not.to.throw();
  });

  it('throws when method does not exist ', async () => {
    const config = getConfig();
    const client = createClient(config);
    // The `ready` method is defined and will not throw
    expect(() => client.trigger('does-not-exist' as EventName)).to.throw();
  });

  it('does not throw when client container exists in the DOM ', async () => {
    const config = getConfig();
    const client = createClient(config);
    expect(client.render()).to.eventually.be.fulfilled;
  });

  it('throws when client container id does not exist in the DOM ', async () => {
    const config = getConfig({ iFrameConfig: { attachToId: '' } });
    const client = createClient(config);
    // The attachToId is invalid and this will throw
    expect(client.render()).to.eventually.be.rejected;
  });

  it('throws when client container is not valid ', async () => {
    const config = getConfig();
    const client = createClient(config);
    expect(client.render()).to.eventually.be.rejected;
  });

  describe('ClientPage validation', () => {
    /* These test are mostly redundant when calling from typescript, but
       it's easy to get it wrong from javascript and we want to handle
       it gracefully when it's wrong */

    const { validatePage } = forTest;

    it('goes to the dashboard by default', () => {
      expect(validatePage()).to.equal(ClientPage.DASHBOARD);
    });

    it('appends a falsy navBar query param to clientUrl if the page is ClientPage.ORDER_RULES', async () => {
      const { getIFrameUrl, getHideNavBarDefault } = forTest;
      const config = getConfig({ iFrameConfig: { attachToId: clientDomId } });
      const hideNavBar = getHideNavBarDefault(ClientPage.ORDER_RULES);
      const url = new URL(getIFrameUrl(ClientPage.ORDER_RULES, '1', hideNavBar, config));
      const searchParams = new URLSearchParams(url.search);
      expect(Boolean(searchParams.get('hideNavBar'))).to.be.false;
    });

    it('appends a falsy navBar query param to clientUrl if the page is ClientPage.SUSPICIOUS_ORDERS', async () => {
      const { getIFrameUrl, getHideNavBarDefault } = forTest;
      const config = getConfig({ iFrameConfig: { attachToId: clientDomId } });
      const hideNavBar = getHideNavBarDefault(ClientPage.SUSPICIOUS_ORDERS);
      const url = new URL(getIFrameUrl(ClientPage.SUSPICIOUS_ORDERS, '1', hideNavBar, config));
      const searchParams = new URLSearchParams(url.search);
      expect(Boolean(searchParams.get('hideNavBar'))).to.be.false;
    });

    it('appends a falsy navBar query param to clientUrl if the page is ClientPage.DASHBOARD', async () => {
      const { getIFrameUrl, getHideNavBarDefault } = forTest;
      const config = getConfig({ iFrameConfig: { attachToId: clientDomId } });
      const hideNavBar = getHideNavBarDefault(ClientPage.DASHBOARD);
      const url = new URL(getIFrameUrl(ClientPage.DASHBOARD, '1', hideNavBar, config));
      const searchParams = new URLSearchParams(url.search);
      expect(Boolean(searchParams.get('hideNavBar'))).to.be.false;
    });

    it('appends truthy navBar query param to clientUrl if the page is ClientPage.ORDER_DETAILS', async () => {
      const { getIFrameUrl, getHideNavBarDefault } = forTest;
      const config = getConfig({ iFrameConfig: { attachToId: clientDomId } });
      const hideNavBar = getHideNavBarDefault(ClientPage.ORDER_DETAILS);
      const orderDetailsUrl = new URL(getIFrameUrl(ClientPage.ORDER_DETAILS, '1', hideNavBar, config));
      const orderDetailsSearchParams = new URLSearchParams(orderDetailsUrl.search);
      expect(Boolean(orderDetailsSearchParams.get('hideNavBar'))).to.be.true;
    });

    it('can override the hideNavBar property', async () => {
      const { getHideNavBarDefault, getHideNavBarSetting } = forTest;
      const noOverride = getHideNavBarSetting(ClientPage.ORDER_DETAILS);
      const overrideToFalse = getHideNavBarSetting(ClientPage.ORDER_DETAILS, false);
      const overrideToTrue = getHideNavBarSetting(ClientPage.ORDER_DETAILS, true);
      expect(noOverride).to.equal(getHideNavBarDefault(ClientPage.ORDER_DETAILS));
      expect(overrideToFalse).to.be.false;
      expect(overrideToTrue).to.be.true;
    });

    it('goes to the dashboard if an invalid page is passed', () => {
      expect(validatePage('' as any)).to.equal(ClientPage.DASHBOARD);
      expect(validatePage(42 as any)).to.equal(ClientPage.DASHBOARD);
    });

    it('goes to the dashboard ORDER_DETAILS is passed and but orderId is not', () => {
      expect(validatePage(ClientPage.ORDER_DETAILS)).to.equal(ClientPage.DASHBOARD);
      expect(validatePage(ClientPage.ORDER_DETAILS, '')).to.equal(ClientPage.DASHBOARD);
    });

    it('returns the page as is if when it is valid', () => {
      expect(validatePage(ClientPage.ORDER_DETAILS)).to.equal(ClientPage.DASHBOARD);
      expect(validatePage(ClientPage.ORDER_DETAILS, '')).to.equal(ClientPage.DASHBOARD);
    });

    it('returns the page as is if when it is valid', () => {
      Object.values(ClientPage).forEach((page) => {
        const orderId = page === ClientPage.ORDER_DETAILS ? '42' : undefined;
        expect(validatePage(page, orderId)).to.equal(page);
      });
    });
  });
});
