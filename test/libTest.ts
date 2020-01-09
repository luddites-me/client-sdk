import { expect } from 'chai';
import lib, { testFn } from '../src/lib';

describe('SAMPLE TEST: basic assertions', () => {
  it('should work', () => {
    expect(lib.msg).to.equal('hello, world');
    expect(testFn()).to.equal(42);
  });
});
