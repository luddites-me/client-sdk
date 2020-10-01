/* eslint-disable
  @typescript-eslint/ban-types,
  no-unused-expressions,
*/
import { expect } from 'chai';
import 'mocha';
import { ClientConfig, EventName } from '..';

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const getBasicConfig = (config?: object): ClientConfig =>
  new ClientConfig({
    accessToken: uuid,
    iFrameConfig: {
      classNames: ['luddites-protect-client-iframe'],
      attachToId: 'luddites-protect-wrapper',
    },
    ...config,
  });

/**
 * Verifies ClientConfig methods work as intended
 */
describe('Asserts that ClientConfig methods are valid', () => {
  beforeEach(() => {
    ClientConfig.DEBUG = false;
  });

  it('throws if access token is missing ', () => {
    expect(() => getBasicConfig({ accessToken: '' })).to.throw();
  });

  it('throws if access token is not a UUID ', () => {
    expect(() => getBasicConfig({ accessToken: '123!@$' })).to.throw();
  });

  it('does not throw if access token is valid ', () => {
    expect(getBasicConfig).not.to.throw();
  });

  it('throws if iFrameConfig is missing', () => {
    // expect(() => new ClientConfig({} as PartialConfig)).to.throw();
    expect(() => getBasicConfig({ iFrameConfig: undefined })).to.throw();
  });

  it('throws if iFrameConfig.attachToId is missing', () => {
    expect(() => getBasicConfig({ iFrameConfig: { attachToId: null } })).to.throw();
  });

  it('throws if iFrameConfig.classNames is not valid', () => {
    expect(() => getBasicConfig({ iFrameConfig: { classNames: 43 } })).to.throw();
    expect(() => getBasicConfig({ iFrameConfig: { classNames: [43] } })).to.throw();
  });

  it('gets production protect client URL by default', () => {
    const config = getBasicConfig();
    const url = config.protectClientUrl.toString();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_PROD_URL.toString());
    expect(startsWithProd).to.be.true;
  });

  it('gets test protect client URL if `DEBUG === true`', () => {
    ClientConfig.DEBUG = true;
    const config = getBasicConfig();
    const url = config.protectClientUrl.toString();
    const startsWithProd = url.startsWith(ClientConfig.PROTECT_TEST_URL.toString());
    expect(startsWithProd).to.be.true;
  });

  it('throws if custom `protectClientUrl` path is not "/"', () => {
    const protectClientUrl = new URL('http://example.com/whoa/');
    expect(() => getBasicConfig({ protectClientUrl })).to.throw();
  });

  it('allows a custom custom `protectClientUrl` if path is "/"', () => {
    let protectClientUrl = new URL('http://example.com');
    let config = getBasicConfig({ protectClientUrl });
    expect(config.protectClientUrl.pathname).to.equal('/');
    protectClientUrl = new URL('http://example.com/');
    config = getBasicConfig({ protectClientUrl });
    expect(config.protectClientUrl.pathname).to.equal('/');
  });

  it('has default order click event ', () => {
    const config = getBasicConfig();
    const defaultEvent = config.eventBinding[EventName.ORDER_DETAIL_NAME_CLICK];
    expect(defaultEvent).is.not.null;
  });

  it('default order click event does not throw ', () => {
    const config = getBasicConfig();
    const defaultEvent = config.eventBinding[EventName.ORDER_DETAIL_NAME_CLICK];
    expect(() => defaultEvent({})).not.to.throw();
  });
});
