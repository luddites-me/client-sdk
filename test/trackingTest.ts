/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import 'mocha';
import { Tracking } from '../src/Tracking';

describe('Asserts that we can access the TrueStats tracking script', () => {
  it('gets the tracking script ', async () => {
    const script = await Tracking.getTrackingScript();
    expect(script).to.be.string;
    const cachedScript = await Tracking.getTrackingScript();
    expect(cachedScript).to.be.string;
  });

  it('fails to get the tracking script from invalid url ', async () => {
    expect(async () => {
      await Tracking.getTrackingScript('https://nope.doesnotexist.ever');
    }).to.throw;
  });

  it('fails to get the tracking script from invalid route ', async () => {
    expect(async () => {
      await Tracking.getTrackingScript('https://test-api-v1.ns8.com/noweb');
    }).to.throw;
  });

  it('gets the tracking script with valid url ', async () => {
    const script = await Tracking.getTrackingScript(Tracking.TRUE_STATS_URL);
    expect(script).to.be.string;
  });
});
