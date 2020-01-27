/* eslint-disable no-unused-expressions */

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import 'mocha';
import { TRUE_STATS_URL, getTrackingScript } from '../src/Tracking';

describe('Asserts that we can access the TrueStats tracking script', () => {
  use(chaiAsPromised);

  it('gets the tracking script ', async () => {
    const url = new URL(TRUE_STATS_URL);
    const scope = nock(url.origin)
      .get(url.pathname)
      .reply(200, 'MOCK SCRIPT CONTENTS');
    const script = await getTrackingScript();
    expect(script).to.be.string;
    expect(scope.isDone()).to.be.true;
    const cachedScript = await getTrackingScript();
    expect(cachedScript).to.be.string;
  });

  it('fails to get the tracking script from invalid url', async () => {
    const noResolveUrlStr = 'https://nope.doesnotexist.ever';
    const url = new URL(noResolveUrlStr);
    const scope = nock(url.origin)
      .get(url.pathname)
      .replyWithError('getaddrinfo ENOTFOUND');

    expect(getTrackingScript(noResolveUrlStr)).to.eventually.be.rejected;
    expect(scope.isDone()).to.be.true;
  });

  it('fails to get the tracking script from invalid route ', async () => {
    const badPathUrlStr = 'https://test-api-v1.ns8.com/noweb';
    const url = new URL(badPathUrlStr);
    const scope = nock(url.origin)
      .get(url.pathname)
      .reply(404);

    expect(getTrackingScript(badPathUrlStr)).to.eventually.be.rejected;
    expect(scope.isDone()).to.be.true;
  });
});
