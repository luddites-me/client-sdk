/* eslint-disable
    @typescript-eslint/no-explicit-any,
    import/prefer-default-export,
    no-param-reassign,
*/
import { ClientConfig } from './ClientConfig';
import { ProtectClient } from './ProtectClient';
import { EventCallback } from './Events';

const Postmate = require('postmate').default || require('postmate');

/**
 * Responsible for rendering the Protect Client SPA
 */
export class Client implements ProtectClient {
  /**
   * Configuration for DOM ids and CSS names
   */
  private readonly config: ClientConfig;

  /**
   *
   * @param config - Configuration object that defines the IDs and names to be fetched from the DOM
   */
  public constructor(partial?: Partial<ClientConfig>) {
    this.config = new ClientConfig(partial);
  }

  // @inheritdoc
  public render = (): Promise<any> => {
    const container: HTMLElement | null = document.getElementById(this.config.iFrame.clientContainerId);
    if (!container) throw new Error(`Could not find element named "${this.config.iFrame.clientContainerId}"`);

    if (ClientConfig.DEBUG) {
      try {
        Postmate.debug = true;
      } catch (error) {
        // log error
      }
    }
    const handshake = new Postmate({
      container,
      url: this.config.getIFrameUrl(),
      classListArray: this.config.iFrame.classNames,
    });

    return new Promise((resolve, reject) => {
      try {
        handshake.then((child: any) => {
          try {
            resolve(child);
            Object.keys(this.config.events).forEach((key) => {
              child.on(key, this.config.events[key]);
            });
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // @inheritdoc
  public trigger = (eventName: string, data: any = null): Promise<any> => {
    const event: EventCallback | undefined = this.config?.events?.[eventName];
    if (!event) {
      throw new Error(`The event named '${eventName}' is not defined on this client.`);
    }
    return event(data);
  };
}
