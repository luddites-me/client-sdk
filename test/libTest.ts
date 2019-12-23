import { expect } from 'chai';
import lib from '../src/lib';

describe('a test!', function() {
  it('should work', () => {
    expect(lib.msg).to.equal('hello, world');
  });
});
