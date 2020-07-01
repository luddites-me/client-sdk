import { ClientConfig } from '../config/clientConfig';
import { ClientPage, EventCallback, EventName, ProtectClient } from '../types/types';
import { createIFrame } from '../internal/iframe';
import { protectLogger } from '../logger/logger';

/* istanbul ignore next: testing this would be basically just copying the code */
const getPathForPage = (page: ClientPage, platformId: string): string => {
  const assertNever = (p: never): never => {
    throw new Error(`Invalid page "${p}"`);
  };

  switch (page) {
    case ClientPage.CAMPAIGN_ACTIVITY:
      return '/report/campaign-activity';
    case ClientPage.DASHBOARD:
      return '/';
    case ClientPage.MONITORS:
      return '/monitors';
    case ClientPage.ORDER_DETAILS:
      return `/order-details/${window.btoa(platformId)}`;
    case ClientPage.ORDER_RULES:
      return '/rules';
    case ClientPage.SUSPICIOUS_ORDERS:
      return '/report/suspicious-orders';
    default:
      return assertNever(page);
  }
};

const getHideNavBarDefault = (page: ClientPage): boolean => {
  switch (page) {
    case ClientPage.DASHBOARD:
      return false;
    case ClientPage.SUSPICIOUS_ORDERS:
      return false;
    case ClientPage.ORDER_RULES:
      return false;
    default:
      return true;
  }
};

const getHideNavBarSetting = (validatedPage: ClientPage, overrideHideNavBar?: boolean): boolean =>
  overrideHideNavBar != null ? overrideHideNavBar : getHideNavBarDefault(validatedPage);

/**
 * Constructs the URL for the IFrame which represents the Protect Client
 *
 * @param page - a {@link ClientPage} indicating which Protect Client base page is to be loaded in the iframe.
 * @param orderId - an id used to fetch order details
 * @param config - a {@link ClientConfig} that supplies an access token.
 */
const getIFrameUrl = (page: ClientPage, orderId: string, hideNavBar: boolean, config: ClientConfig): string => {
  const url = new URL(config.protectClientUrl.toString());
  const searchParams = new URLSearchParams();

  url.pathname = getPathForPage(page, orderId);
  searchParams.set('accessToken', config.accessToken);
  searchParams.set('noredirect', '1');
  if (hideNavBar) {
    searchParams.set('hideNavBar', '1');
  }
  url.search = `${searchParams}`;

  return `${url}`;
};

/**
 * Checks whether a string is empty or null.
 *
 * @param myString - The string to check
 */
const isEmptyString = (myString?: string): boolean => myString == null || myString === '';

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
  let validPage = page;
  if (!Object.values(ClientPage).some((p) => page === p)) {
    protectLogger.error('invalid ClientPage: %s', page);
    validPage = ClientPage.DASHBOARD;
  }
  if (validPage === ClientPage.ORDER_DETAILS && isEmptyString(platformId)) {
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
  public async render(
    page: ClientPage = ClientPage.DASHBOARD,
    platformId?: string,
    overrideHideNavBar?: boolean,
  ): Promise<void> {
    const { attachToId, classNames } = this.config.iFrameConfig;
    const validatedPage = validatePage(page, platformId);
    const hideNavBar = getHideNavBarSetting(validatedPage, overrideHideNavBar);
    createIFrame({
      classNames,
      containerId: attachToId,
      clientUrl: getIFrameUrl(validatedPage, platformId || '', hideNavBar, this.config),
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
}

/**
 * Create client utilizing config
 * @param config - The client config data used for initialization
 * @internal
 */
export const createClient = (config: ClientConfig): ProtectClient => new Client(config);
/**
 * Values required for testing
 * @internal
 */
export const forTest = {
  getPathForPage,
  validatePage,
  getIFrameUrl,
  getHideNavBarDefault,
  getHideNavBarSetting,
};
