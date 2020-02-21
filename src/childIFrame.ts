import { CrossDomainMessage } from './types';

/**
 *
 * Interface for the iframed application configuration object.
 *
 */

interface ChildIFrameConfig {
  /*
   * Called once, when the iframe-resizer's iframed script is fully initialized
   */
  onReady: () => void;

  /*
   *  Called when the child/iframed application receives a message from the parent application.
   */
  onMessage: (message: CrossDomainMessage) => void;

  /*
   *  An optional function to define how the height is calculated from within the iframed page.
   */
  heightCalculationMethod?: () => number | void;
}

/*
 *
 * Interface for the communicating with the parent iframe.
 *
 */

interface ParentIFrameAPI {
  /**
   * Send a {@link CrossDomainMessage} to the parent application embedding the iframed application.
   */
  sendMessage: (message: CrossDomainMessage, targetOrigin?: string) => void;
}

/*
 * Extends the {@link Window} interface allowing for optional properties
 * that the iframe-resizer library adds to the window global.
 */

export interface CustomWindow extends Window {
  /**
   * A {@link ChildIFrame} configuration object that the iframe-resizer picks up once it loads.
   */

  iFrameResizer?: ChildIFrameConfig;

  /**
   * A communication object that is bound to the window by iframe-resizer once it loads. Configured with a {@link ChildIFrameConfig}.
   */
  parentIFrame?: ParentIFrameAPI | undefined;
}

/*
 *
 */

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
