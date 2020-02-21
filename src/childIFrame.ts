import { CrossDomainMessage } from './types';

interface ChildIFrameConfig {
  onReady: () => void;
  onMessage: (message: CrossDomainMessage) => void;
  heightCalculationMethod?: () => number | void;
}

interface ParentIFrameAPI {
  sendMessage: (message: CrossDomainMessage, targetOrigin?: string) => void;
}

export interface CustomWindow extends Window {
  iFrameResizer?: ChildIFrameConfig;
  parentIFrame?: ParentIFrameAPI | undefined;
}

export class ChildIFrame {
  public parent: ParentIFrameAPI | undefined;

  constructor(window: CustomWindow, config: ChildIFrameConfig) {
    this.init(window, config);
  }

  private init(window: CustomWindow, config: ChildIFrameConfig): void {
    // the window is required for the class instantiation,
    // so we add the resizer config to it, so that once it loads,
    // it can pick this up and register our config.

    /* eslint-disable-next-line no-param-reassign */
    window.iFrameResizer = {
      heightCalculationMethod: config.heightCalculationMethod,
      onMessage: config.onMessage,
      onReady: (): void => {
        this.parent = window.parentIFrame;
        if (!this.parent) {
          return;
        }
        config.onReady();
      },
    };
  }

  /* istanbul ignore next */
  public sendMessage(message: CrossDomainMessage): void {
    if (this.parent) {
      this.parent.sendMessage(message);
    }
  }
}
