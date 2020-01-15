/* eslint-disable no-underscore-dangle */
import { EventBinding, EventNames } from './Events';

/**
 * Configuration options for rendering the Protect Client
 */
export class ClientConfig {
  public static readonly PROTECT_TEST_URL = 'https://test-protect-client.ns8.com';

  public static readonly PROTECT_PROD_URL = 'https://protect-client.ns8.com';

  public constructor(partial?: Partial<ClientConfig>) {
    Object.assign(this, partial || {});
  }

  public static DEBUG = false;

  /**
   * The Protect access token required for authenticating the request to inject the IFrame
   */
  public accessToken!: string;

  /**
   * Internal collection of events. This should only ever be set once, on or immediately after construction.
   */
  private _events: EventBinding | undefined;

  /**
   * Events to which we will bind on client initialization
   */
  public get events(): EventBinding {
    if (!this._events) {
      this._events = {};
      this._events[EventNames.ORDER_DETAIL_NAME_CLICK] = (data: any): Promise<any> => {
        return Promise.resolve();
      };
    }
    return this._events;
  }

  /**
   * If events have not yet been defined, you can set them now. Note this can be done only once.
   */
  public set events(val) {
    if (!this._events) {
      this._events = val;
    } else {
      throw new Error('Events cannot be redefined once set.');
    }
  }

  /**
   * Configuration options for rendering the Client
   */
  public page!: PageConfig;

  /**
   * Constructs the URL for the IFrame which represents the Protect Client
   *
   * @param accessToken - optional override for the original access token
   */
  public getIFrameUrl = (accessToken: string | undefined = undefined): string => {
    const token = accessToken || this.accessToken;
    let iFrameUrl = ClientConfig.PROTECT_PROD_URL;
    if (!token) throw new Error('An access token is required');
    if (ClientConfig.DEBUG) {
      iFrameUrl = ClientConfig.PROTECT_TEST_URL;
    }
    return `${iFrameUrl}?accessToken=${token}&noredirect=1`;
  };
}

/**
 * Configuration options for rendering the Client
 */
export class PageConfig {
  public constructor(partial?: Partial<PageConfig>) {
    Object.assign(this, partial || {});
  }

  /**
   * An array of CSS class names to attach to.
   * In Magento, this was `['ns8-protect-client-iframe']`
   */
  public classNames!: string[];

  /**
   * The ID of the root DOM node to which the Client is attached.
   * In Magento, this was `'ns8-protect-wrapper'`
   */
  public clientContainerId!: string;

  /**
   * The height to set the client iframe.
   * In Magento, this was `calc(100vh - ${container.offsetTop}px - 20px)`
   */
  public clientHeight!: string;

  /**
   * Padding (in pixels) to add to the top of the container.
   * In Magento, this was `419`.
   */
  public clientPaddingTop!: number;

  /**
   * The ID of the root DOM node to which an order.
   * In Magento, this was `'sales_order_view_tabs_ns8_protect_order_review_content'`
   */
  public orderContainerId!: string;
}
