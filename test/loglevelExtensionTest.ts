/* eslint-disable no-unused-expressions */

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import log from 'loglevel';
import nock from 'nock';
import 'mocha';

import { ProtectClientErrorLogOptions } from '../src/types';
import { configureLogger, getCurrentErrorLogRequestPromise } from '../src/internal/loglevelExtension';

describe('Protect Client Error Log extension for `loglevel`', () => {
  use(chaiAsPromised);

  const fakeClientErrorLogUrl = new URL('http://localhost:4000/api/util/log-client-error');
  const testLogConfig: ProtectClientErrorLogOptions = {
    includeStack: false,
    url: fakeClientErrorLogUrl.toString(),
    level: log.levels.ERROR,
  };

  const mockNetwork = (body?: nock.RequestBodyMatcher): nock.Scope =>
    nock(fakeClientErrorLogUrl.origin)
      .post(fakeClientErrorLogUrl.pathname, body)
      .reply(200, '{ "logged": true }');

  const errorLogPost = async (): Promise<void> => {
    const p = getCurrentErrorLogRequestPromise();
    if (p != null) await p;
  };

  let originalMethodFactory: log.MethodFactory | null = null;
  const resetLoglevel = (): void => {
    if (originalMethodFactory != null) {
      log.methodFactory = originalMethodFactory;
    }
  };

  beforeEach(() => {
    originalMethodFactory = log.methodFactory;
  });

  afterEach(resetLoglevel);

  it('does not post logs when not configured', async () => {
    const scope = mockNetwork();
    log.error('msg');
    expect(scope.isDone()).to.be.false;
    nock.cleanAll();
  });

  it('configures the `loglevel` root logger', async () => {
    configureLogger(log, testLogConfig);
    expect(log.methodFactory).not.to.equal(originalMethodFactory);
  });

  it('throws exception when configured with invalid argument', async () => {
    expect(() => configureLogger({} as log.RootLogger, testLogConfig)).to.throw();
  });

  describe('when `loglevel` is configured to post to the protect client error log', () => {
    beforeEach(() => {
      configureLogger(log, testLogConfig);
    });

    it('post logs to the endpoint', async () => {
      const scope = mockNetwork();
      log.error('msg');
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });

    it('post logs with the correct Content-Type header', async () => {
      const scope = mockNetwork();
      scope.matchHeader('Content-Type', 'application/json');
      log.error('msg');
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });

    it('post logs with the correct body content', async () => {
      const scope = mockNetwork(
        JSON.stringify({
          errString: 'msg',
          stackTrace: '',
        }),
      );
      log.error('msg');
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });

    it('queues multiple calls to avoid blocking', async () => {
      const callCount = 10;
      const scope = nock(fakeClientErrorLogUrl.origin)
        .post(fakeClientErrorLogUrl.pathname)
        .times(callCount)
        .reply(200, '{ "logged": true }');

      for (let i = 0; i < callCount; i += 1) {
        log.error('msg : %d', i);
      }
      expect(scope.isDone()).to.be.false;
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });

    it('does not throw in case of network failures', async () => {
      const scope = nock(fakeClientErrorLogUrl.origin)
        .post(fakeClientErrorLogUrl.pathname)
        .replyWithError('getaddrinfo ENOTFOUND');
      log.error('msg');
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });
  });

  describe('stacktraces', () => {
    it('are included when specified in the config', async () => {
      const logConfig: ProtectClientErrorLogOptions = {
        ...testLogConfig,
        includeStack: true,
      };
      configureLogger(log, logConfig);
      const body = JSON.stringify({
        errString: 'msg',
        stackTrace: 'XXX',
      });
      const scope = nock(fakeClientErrorLogUrl.origin)
        .filteringRequestBody(/"stackTrace":".+"/, '"stackTrace":"XXX"')
        .post(fakeClientErrorLogUrl.pathname, body)
        .reply(200, '{ "logged": true }');
      log.error('msg');
      await errorLogPost();
      expect(scope.isDone()).to.be.true;
    });
  });
});
