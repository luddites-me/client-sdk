import 'mocha';
import { expect } from 'chai';
import testMe from '../src/lib';

describe('sample test', () => {
  it('works!', () => {
    expect(testMe()).to.equal('hello, world!');
  });
});
