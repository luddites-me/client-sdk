/* eslint-disable no-unused-expressions */
/* eslint-disable
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unused-vars,
    no-console,
    no-empty,
    no-unused-vars,
  */
/* global Protect, Postmate */
import { expect, use } from 'chai';
import chaiAsPromised = require('chai-as-promised');
import { JSDOM } from 'jsdom';

import 'mocha';
import { ClientConfig, EventName, createClient } from '../src';

// We need to inform the compiler that Protect is a global variable
declare let Protect: any;
declare let Postmate: any;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      document: {};
      window: {};
    }
  }
}

// Change these to enable debugging
const USE_HEADLESS_BROWSER = true;
const ENABLE_DEVTOOLS_IN_BROWSER = false;

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const clientDomId = 'ns8-protect-client-iframe';
const clientClassName = 'ns8-protect-client-iframe';
const getConfig = (config?: object): ClientConfig =>
  new ClientConfig({
    accessToken: uuid,
    eventBinding: {
      [EventName.NS8_PROTECT_CLIENT_CONNECTED]: (data: any): Promise<any> => Promise.resolve(),
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

  it('throws when client container does not exist in the DOM ', async () => {
    const config = getConfig({ iFrameConfig: { attachToId: '' } });
    const client = createClient(config);
    expect(client.render()).to.eventually.be.rejected;
  });

  it('throws when client container is not valid ', async () => {
    const config = getConfig();
    const client = createClient(config);
    expect(client.render()).to.eventually.be.rejected;
  });

});
