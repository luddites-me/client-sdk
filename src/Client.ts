import Postmate from 'postmate';

import { ClientConfig } from './ClientConfig';
import { ProtectClient } from './types';
import { EventCallback } from './Events';
import { protectLogger } from './logger';

// KLUDGE: Postmate is going away. For now, this is a hack to support differences between
// the way that node require vs browser require behave
// const Postmate = require('postmate').default || require('postmate');
/**
 * Responsible for rendering the Protect Client SPA
 */
class Client implements ProtectClient {
  protected config: ClientConfig;

  /**
   *
   * @param config - Configuration object that defines the IDs and names to be fetched from the DOM
   */
  public constructor(config: ClientConfig) {
    this.config = config;
  }

  // @inheritdoc
  /* istanbul ignore next: gutting with new `iframe-resizer` code soon */
  public async render(): Promise<void> {
    const container: HTMLElement | null = document.getElementById(this.config.iFrame.attachToId);
    if (!container) throw new Error(`Could not find element named "${this.config.iFrame.attachToId}"`);

    if (ClientConfig.DEBUG && Postmate != null) {
      Postmate.debug = true;
    }

    const handshake = new Postmate({
      container,
      url: this.config.getIFrameUrl(),
      classListArray: this.config.iFrame.classNames,
    });

    try {
      const child = await handshake;
      Object.keys(this.config.events).forEach((key) => {
        child.on(key, this.config.events[key]);
      });
    } catch (error) {
      protectLogger.error(error);
      throw error;
    }
  }

  // @inheritdoc
  public trigger = (eventName: string, data: unknown = null): Promise<unknown> => {
    const event: EventCallback | undefined = this.config.events[eventName];
    if (!event) {
      throw new Error(`The event named '${eventName}' is not defined on this client.`);
    }
    return event(data);
  };
}

export const createClient = (config: ClientConfig): ProtectClient => new Client(config);
