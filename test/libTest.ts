import { expect } from 'chai';
import { data, testFn } from '../src/lib';

describe('a test!', () => {
  it('should work', () => {
    expect(data.msg).to.equal('Hello, world!');
    expect(testFn()).to.equal(42);
  });
});
