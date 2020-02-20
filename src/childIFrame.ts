import { CrossDomainMessage } from './types';

interface ChildIFrameConfig {
  onReady: () => void;
  onMessage: (message: CrossDomainMessage) => void;
  heightCalculationMethod?: () => number | void;
}

interface ParentIFrameAPI {
  sendMessage: (message: CrossDomainMessage, targetOrigin?: string) => void;
}

interface CustomWindow extends Window {
  iFrameResizer?: ChildIFrameConfig;
  parentIFrame?: ParentIFrameAPI | undefined;
}

declare let window: CustomWindow;


export class ChildIFrame {

  private parent: ParentIFrameAPI | undefined;

  constructor(window: Window, config: ChildIFrameConfig) {
    this.init(config);
  }

  init(config: ChildIFrameConfig) {

    // the window is required for the class instantiation,
    // so we add the resizer config to it, so that once it loads,
    // it can pick this up and register our config.
    window.iFrameResizer = {
      heightCalculationMethod: config.heightCalculationMethod,
      onMessage: config.onMessage,
      onReady: () => {
        this.parent = window.parentIFrame;
        if (!this.parent) {
          return;
        }
        config.onReady();
      },
    };

  }

}
