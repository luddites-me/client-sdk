import Postmate from 'postmate';

import { ClientConfig } from './clientConfig';
import { ClientPage, EventCallback, EventName, ProtectClient } from './types';
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
  public async render(page: ClientPage = ClientPage.DASHBOARD, orderId?: string): Promise<void> {
    const container: HTMLElement | null = document.getElementById(this.config.iFrameConfig.attachToId);
    if (!container) throw new Error(`Could not find element named "${this.config.iFrameConfig.attachToId}"`);

    if (page === ClientPage.ORDER_DETAILS && orderId == null) {
      throw new Error('must specify `orderId` for `ClientPage.ORDER_DETAILS`');
    }

    if (ClientConfig.DEBUG && Postmate != null) {
      Postmate.debug = true;
    }

    const handshake = new Postmate({
      container,
      url: this.getIFrameUrl(page, orderId || ''),
      classListArray: this.config.iFrameConfig.classNames,
    });

    try {
      const child = await handshake;
      Object.values(EventName).forEach((eventName) => {
        child.on(eventName, this.config.eventBinding[eventName]);
      });
    } catch (error) {
      protectLogger.error(error);
      throw error;
    }
  }

  // @inheritdoc
  public trigger(eventName: EventName, data: unknown = null): Promise<unknown> {
    const event: EventCallback = this.config.eventBinding[eventName];
    if (!event) {
      throw new Error(`The event named '${eventName}' is not defined on this client.`);
    }
    return event(data);
  }

  /**
   * Constructs the URL for the IFrame which represents the Protect Client
   *
   * @param accessToken - optional UUID to override the original access token.
   */
  private getIFrameUrl(page: ClientPage, orderId: string): string {
    // eslint-disable-next-line consistent-return
    const getPathForPage = (): string => {
      // requiring a default case here breaks TS exhaustive checking
      /* istanbul ignore next: write tests for this after `iframe-resizer` is integrated */
      // eslint-disable-next-line default-case
      switch (page) {
        case ClientPage.DASHBOARD:
          return '/';
        case ClientPage.ORDER_DETAILS:
          return `/order-details/${atob(orderId)}`;
        case ClientPage.ORDER_RULES:
          return '/rules';
        case ClientPage.SUSPICIOUS_ORDERS:
          return '/report/suspicious-orders';
      }
    };

    const url = new URL(this.config.protectClientUrl.toString());
    url.pathname = getPathForPage();
    return `${url}?accessToken=${this.config.accessToken}&noredirect=1`;
  }
}

export const createClient = (config: ClientConfig): ProtectClient => new Client(config);
