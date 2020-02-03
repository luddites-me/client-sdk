import { ClientConfig } from './clientConfig';
import { ClientPage, EventCallback, EventName, ProtectClient } from './types';
import { createIFrame } from './internal/iframe';
import { protectLogger } from './logger';

/* istanbul ignore next: testing this would be basically just copying the code */
// eslint-disable-next-line consistent-return
const getPathForPage = (page: ClientPage, orderId: string): string => {
  // requiring a default case here breaks TS exhaustive checking
  // eslint-disable-next-line default-case
  switch (page) {
    case ClientPage.DASHBOARD:
      return '/';
    case ClientPage.ORDER_DETAILS:
      return `/order-details/${btoa(orderId)}`;
    case ClientPage.ORDER_RULES:
      return '/rules';
    case ClientPage.SUSPICIOUS_ORDERS:
      return '/report/suspicious-orders';
  }
};

/**
 * Performs runtime validation that a `page` passed from javascript is a valid
 * {@link ClientPage} enum value, and ensures that the `platformId` is passed if
 * `page` is {@link clientPage.ORDER_DETAILS}
 * @param page - The `ClientPage` value to validate
 * @param platformId - The `platformId` to display on the order details page
 */
const validatePage = (page?: ClientPage, platformId?: string): ClientPage => {
  if (page == null) {
    return ClientPage.DASHBOARD;
  }
  const isValidPage = Object.values(ClientPage).some((p) => page === p);
  if (!isValidPage) {
    protectLogger.error('invalid ClientPage: %s', page);
  }
  let validPage = isValidPage ? page : ClientPage.DASHBOARD;
  if (validPage === ClientPage.ORDER_DETAILS && (platformId == null || platformId === '')) {
    protectLogger.error('must pass orderId for ClientPage.ORDER_DETAILS');
    validPage = ClientPage.DASHBOARD;
  }
  return validPage;
};

/**
 * Responsible for rendering the Protect Client SPA
 */
class Client implements ProtectClient {
  protected config: ClientConfig;

  /**
   * @param config - {@link ClientConfig}
   */
  public constructor(config: ClientConfig) {
    this.config = config;
  }

  // @inheritdoc
  public async render(page: ClientPage = ClientPage.DASHBOARD, platformId?: string): Promise<void> {
    const { attachToId, classNames } = this.config.iFrameConfig;
    createIFrame({
      classNames,
      containerId: attachToId,
      clientUrl: this.getIFrameUrl(validatePage(page), platformId || ''),
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
    const url = new URL(this.config.protectClientUrl.toString());
    url.pathname = getPathForPage(page, orderId);
    return `${url}?accessToken=${this.config.accessToken}&noredirect=1`;
  }
}

export const createClient = (config: ClientConfig): ProtectClient => new Client(config);
export const forTest = { getPathForPage, validatePage };
