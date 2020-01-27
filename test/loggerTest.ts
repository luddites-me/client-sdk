import { expect } from 'chai';

import { LogLevel, configureProtectLogger } from '../src/logger';

describe('protect logger module', () => {
  it('configures the protect client error log ', () => {
    expect(() =>
      configureProtectLogger({
        url: 'fakeUrl',
        includeStack: false,
        level: LogLevel.ERROR,
      }),
    ).not.to.throw();
  });
});
