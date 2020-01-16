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
import 'mocha';
import { ClientConfig, EventNames, IFrameConfig } from '../src';

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const getBasicConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: uuid,
    iFrame: new IFrameConfig({
      classNames: ['ns8-protect-client-iframe'],
      clientContainerId: 'ns8-protect-wrapper',
    }),
  });
};

const getNoAccessTokenConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: '',
    iFrame: new IFrameConfig({
      classNames: ['ns8-protect-client-iframe'],
      clientContainerId: 'ns8-protect-wrapper',
    }),
  });
};

const getInvalidAccessTokenConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: '123!@$',
    iFrame: new IFrameConfig({
      classNames: ['ns8-protect-client-iframe'],
      clientContainerId: 'ns8-protect-wrapper',
    }),
  });
};

describe('Asserts that ClientConfig methods are valid', () => {
  beforeEach(() => {
    ClientConfig.DEBUG = false;
  });

  it('throws if access token is missing ', async () => {
    expect(() => {
      const config = getNoAccessTokenConfig();
      // With no access token defined, this will throw
      config.getIFrameUrl();
    }).to.throw();
  });

  it('throws if access token is not a UUID ', async () => {
    expect(() => {
      const config = getInvalidAccessTokenConfig();
      // With an invalid access token defined, this will throw
      config.getIFrameUrl();
    }).to.throw();
  });

  it('get iFrame throws if access token is not a UUID ', async () => {
    expect(() => {
      const config = getBasicConfig();
      // With an invalid access token passed, this will throw
      config.getIFrameUrl('123!@#');
    }).to.throw();
  });

  it('does not throw if access token is valid ', async () => {
    expect(() => {
      const config = getBasicConfig();
      // With an access token defined, this will not throw
      config.getIFrameUrl();
    }).not.to.throw();
  });

  it('generates the same IFrame URL ', async () => {
    const config = getBasicConfig();
    const url = config.getIFrameUrl();
    expect(url).to.equal(config.getIFrameUrl(uuid));
  });

  it('gets production IFrame URL ', async () => {
    const config = getBasicConfig();
    const url = config.getIFrameUrl();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_PROD_URL);
    expect(startsWithProd).to.be.true;
  });

  it('gets test IFrame URL ', async () => {
    ClientConfig.DEBUG = true;
    const config = getBasicConfig();
    const url = config.getIFrameUrl();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_TEST_URL);
    expect(startsWithProd).to.be.true;
  });

  it('has default order click event ', async () => {
    const config = getBasicConfig();
    const defaultEvent = config.events[EventNames.ORDER_DETAIL_NAME_CLICK];
    expect(defaultEvent).is.not.null;
  });

  it('default order click event does not throw ', async () => {
    const config = getBasicConfig();
    const defaultEvent = config.events[EventNames.ORDER_DETAIL_NAME_CLICK];
    expect(() => defaultEvent({})).not.to.throw();
  });

  it('events cannot be reassigned ', async () => {
    expect(() => {
      const config = getBasicConfig();
      // Event object cannot be reassigned
      config.events = {};
    }).to.throw();
  });
});
