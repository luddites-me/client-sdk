import { ClientConfig } from './clientConfig';
import { ClientPage, EventCallback, EventName, ProtectClient } from './types';
import { protectLogger } from './logger';
import { createIFrame } from './internal/iframe';

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
  public async render(page: ClientPage = ClientPage.DASHBOARD, orderId?: string): Promise<void> {
    const { attachToId, classNames } = this.config.iFrameConfig;
    createIFrame({
      classNames,
      containerId: attachToId,
      clientUrl: this.getIFrameUrl(page, orderId || ''),
      debug: ClientConfig.DEBUG,
      eventBinding: this.config.eventBinding,
    });
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
