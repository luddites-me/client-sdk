/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import 'mocha';
import { ChildIFrame, CrossDomainMessage, CustomWindow } from '../src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      document: {};
      window: {};
    }
  }
}

describe('Asserts that the childIFrame is initialized on the Window object', () => {
  it('adds the iframe-resizer parent config to window on init', async () => {
    const { window } = new JSDOM('<!DOCTYPE html><div></div>');
    const customWindow = window as CustomWindow;
    const childIFrameConfig = {
      heightCalculationMethod: (): number => 42,
      onMessage(message: CrossDomainMessage): void {
        /* eslint-disable-next-line no-console */
        console.log(message);
      },
      onReady(): void {
        /* eslint-disable-next-line no-console */
        console.log('ready');
      },
    };
    const childIFrame = new ChildIFrame(customWindow, childIFrameConfig);
    expect(customWindow).to.have.property('iFrameResizer');
    expect(customWindow.iFrameResizer).to.have.property('heightCalculationMethod');
    expect(customWindow.iFrameResizer).to.have.property('onMessage');
    expect(customWindow.iFrameResizer).to.have.property('onReady');
    expect(customWindow.iFrameResizer?.onReady).to.be.a('function');
    customWindow.parentIFrame = {
      sendMessage(message: CrossDomainMessage): void {
        /* eslint-disable-next-line no-console */
        console.log(message);
      },
    };

    customWindow.iFrameResizer?.onReady();
    expect(childIFrame.parent).to.have.property('sendMessage');
    expect(childIFrame.sendMessage).to.be.a('function');
  });

  it('should not have a parent', async () => {
    const { window } = new JSDOM('<!DOCTYPE html><div></div>');
    const customWindow = window as CustomWindow;
    const childIFrameConfig = {
      heightCalculationMethod: (): number => 42,
      onMessage(message: CrossDomainMessage): void {
        /* eslint-disable-next-line no-console */
        console.log('on ready', message);
      },
      onReady(): void {
        /* eslint-disable-next-line no-console */
        console.log('on ready');
      },
    };
    const childIFrame = new ChildIFrame(customWindow, childIFrameConfig);
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    (customWindow.iFrameResizer || { onReady: (): void => {} }).onReady();
    expect(childIFrame.parent).to.be.undefined;
    expect(childIFrame.sendMessage).to.be.a('function');
  });
});
