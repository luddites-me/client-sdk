import { expect } from 'chai';

import { ClientConfig } from '../config/clientConfig';
import { LogLevel, configureProtectLogger } from './logger';

const uuid = '27802062-34c4-450c-a18f-667324f14375';
const getBasicConfig = (): ClientConfig => {
  return new ClientConfig({
    accessToken: uuid,
    iFrameConfig: { attachToId: 'x' },
    protectClientUrl: new URL('http://example.com/'),
  });
};

describe('protect logger module', () => {
  it('configures the protect client error log ', () => {
    expect(() =>
      configureProtectLogger(
        {
          includeStack: false,
          level: LogLevel.ERROR,
        },
        getBasicConfig(),
      ),
    ).not.to.throw();
  });
});
