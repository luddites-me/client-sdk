import { expect } from 'chai';
import { data, testFn } from '../src/lib';

describe('SAMPLE TEST: basic assertions', () => {
  it('should work', () => {
    expect(data.msg).to.equal('hello, world!');
    expect(testFn()).to.equal(42);
  });
});
