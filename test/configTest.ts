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
import { ClientConfig, EventName, IFrameConfig } from '../src';

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const getBasicConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: uuid,
    iFrameConfig: {
      classNames: ['ns8-protect-client-iframe'],
      attachToId: 'ns8-protect-wrapper',
    },
  });
};

const getNoAccessTokenConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: '',
    iFrameConfig: {
      classNames: ['ns8-protect-client-iframe'],
      attachToId: 'ns8-protect-wrapper',
    },
  });
};

const getInvalidAccessTokenConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: '123!@$',
    iFrameConfig: {
      classNames: ['ns8-protect-client-iframe'],
      attachToId: 'ns8-protect-wrapper',
    },
  });
};

describe('Asserts that ClientConfig methods are valid', () => {
  beforeEach(() => {
    ClientConfig.DEBUG = false;
  });

  it('returns correct protect client error log endpoint', () => {
    const config = getBasicConfig();
    // expect(config.protectClientLogEndpoint.toString().endsWith('/api/util/log-client-error')).to.be.true;
  });

  it('throws if access token is missing ', async () => {
    // With no access token defined, this will throw
    expect(getNoAccessTokenConfig).to.throw();
  });

  it('throws if access token is not a UUID ', async () => {
    // With an invalid access token defined, this will throw
    expect(getInvalidAccessTokenConfig).to.throw();
  });

  it('does not throw if access token is valid ', async () => {
    expect(getBasicConfig).not.to.throw();
  });

  it('gets production IFrame URL ', async () => {
    const config = getBasicConfig();
    const url = config.protectClientUrl.toString();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_PROD_URL.toString());
    expect(startsWithProd).to.be.true;
  });

  it('gets test IFrame URL ', async () => {
    ClientConfig.DEBUG = true;
    const config = getBasicConfig();
    const url = config.protectClientUrl.toString();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_TEST_URL.toString());
    expect(startsWithProd).to.be.true;
  });

  it('has default order click event ', async () => {
    const config = getBasicConfig();
    const defaultEvent = config.eventBinding[EventName.ORDER_DETAIL_NAME_CLICK];
    expect(defaultEvent).is.not.null;
  });

  it('default order click event does not throw ', async () => {
    const config = getBasicConfig();
    const defaultEvent = config.eventBinding[EventName.ORDER_DETAIL_NAME_CLICK];
    expect(() => defaultEvent({})).not.to.throw();
  });
});
