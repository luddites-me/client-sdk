/* eslint-disable
  no-unused-expressions,
  no-unused-vars,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-namespace,
  @typescript-eslint/no-unused-vars,
  @typescript-eslint/no-empty-function,
  @typescript-eslint/ban-types,
*/
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import 'mocha';
import { CustomWindow, getCurrentMinIframeHeight, initIFrame } from './childIFrame';
import { LAST_PAGE_INFO_GLOBAL } from '../types/types';

/**
 * Global reference space to define NodeJS in test context
 */
declare global {
  namespace NodeJS {
    interface Global {
      document: {};
      window: {};
    }
  }
}

/**
 * HTML div to utilize unit testing
 */
const testDivMarkup = '<div id="test"></div>';

/**
 * Test utility functions to ensure the logic runs as expected
 */
describe('Test utility functions', () => {
  const { window } = new JSDOM('<!DOCTYPE html><div></div>');
  const customWindow = (window as unknown) as CustomWindow;
  window.document.body.innerHTML = testDivMarkup;

  const testDiv = window.document.body.querySelector('#test') as HTMLDivElement;
  initIFrame(testDiv, customWindow);

  it('getCurrentMinIframeHeight returns 600 by default with a null pageInfo object', () => {
    const height = getCurrentMinIframeHeight(customWindow);
    expect(height).to.be.a('number');
    expect(height).to.equal(600);
  });
});

/**
 * Ensures that the childIframe functions as expected
 */
describe('Asserts that the childIFrame is initialized on the Window object', () => {
  const { window } = new JSDOM('<!DOCTYPE html><div></div>');
  const customWindow = (window as unknown) as CustomWindow;
  window.document.body.innerHTML = testDivMarkup;

  it('getCurrentMinIframeHeight returns a value dependent on pageInfo object.', () => {
    customWindow[LAST_PAGE_INFO_GLOBAL] = {
      iframeHeight: 400,
      iframeWidth: 400,
      offsetLeft: 400,
      offsetTop: 400,
      scrollLeft: 400,
      scrollTop: 400,
      documentHeight: 400,
      documentWidth: 400,
      windowHeight: 400,
      windowWidth: 400,
    };

    const testDiv = window.document.body.querySelector('#test') as HTMLDivElement;
    initIFrame(testDiv, customWindow);
    expect(getCurrentMinIframeHeight(customWindow)).to.equal(400);
    expect(customWindow.iFrameResizer?.heightCalculationMethod()).to.equal(400);
  });

  it('the child-page iFrameResizer configuration object is bound to the window after instantiation', async () => {
    const testDiv = window.document.querySelector('#test') as Element;

    initIFrame(testDiv, customWindow);

    expect(customWindow).to.have.property('iFrameResizer');
    expect(customWindow.iFrameResizer).to.have.property('onReady');
    expect(customWindow.iFrameResizer).to.have.property('heightCalculationMethod');
  });

  it('should throw if the child iframe object isnt available', () => {
    customWindow.parentIFrame = {
      sendMessage: (message: any): void => {},
      getPageInfo: (any): void => {},
    };
    window.document.body.innerHTML = testDivMarkup;
    const testDiv = window.document.querySelector('#test') as Element;

    initIFrame(testDiv, customWindow);
    expect(() => {
      customWindow.iFrameResizer?.onReady();
    }).not.to.throw();

    expect(customWindow[LAST_PAGE_INFO_GLOBAL]).is.an('object');
  });

  it('should throw if the child iframe object isnt available', () => {
    customWindow.parentIFrame = undefined;
    window.document.body.innerHTML = testDivMarkup;
    const testDiv = window.document.querySelector('#test') as Element;

    initIFrame(testDiv, customWindow);
    expect(() => {
      customWindow.iFrameResizer?.onReady();
    }).to.throw();
  });
});
