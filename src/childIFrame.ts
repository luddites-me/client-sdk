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
   * A communication object bound to the window by iframe-resizer once it loads. iframe-resizer configures this with the {@link ChildIFrameConfig}.
   */
  parentIFrame?: ParentIFrameAPI | undefined;
}

/*
 * Initialize the cross-domain iframe messanging library to enable cross-domain message passing to the parent application.
 * @param window - a {@link CustomWindow} with optional iframe-resizer properties to be bound upon the library initialization.
 * @param config - a {@link ChildIFrameConfig} object used to instantiate the iframed application messaging object.
 */

export class ChildIFrame {
  public parent: ParentIFrameAPI | undefined;

  constructor(window: CustomWindow, config: ChildIFrameConfig) {
    this.init(window, config);
  }

  /*
   * initialize the window's {@link ChildIFrameConfig} object required by iframe-resizer. 
   */
  private init(window: CustomWindow, config: ChildIFrameConfig): void {

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

  /*
   * Sends a {@link CrossDomainMessage} to the parent application domain. 
   */

  /* istanbul ignore next */
  public sendMessage(message: CrossDomainMessage): void {
    if (this.parent) {
      this.parent.sendMessage(message);
    }
  }
}
