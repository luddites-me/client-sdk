/* eslint-disable no-underscore-dangle */
import validate from 'uuid-validate';
import { EventBinding, EventName, FullEventBinding } from './Events';

const noopEventCallback = (): Promise<void> => Promise.resolve();

/**
 * Configuration options for rendering the Protect Client
 */
export class ClientConfig {
  public static readonly PROTECT_TEST_URL = 'https://test-protect-client.ns8.com';

  public static readonly PROTECT_PROD_URL = 'https://protect-client.ns8.com';

  /**
   * This can be set to true to allow more verbose options when debugging.
   */
  public static DEBUG = false;

  /**
   * The Protect access token required for authenticating the request to inject the IFrame.
   * This should always be a UUID.
   */
  public accessToken: string;

  /**
   * Configuration options for rendering the Client
   */
  public iFrameConfig: IFrameConfig;

  public protectClientUrl: string;

  /**
   * Internal collection of events.
   */
  public eventBinding: FullEventBinding = {
    [EventName.NS8_PROTECT_CLIENT_CONNECTED]: noopEventCallback,
    [EventName.ORDER_DETAIL_NAME_CLICK]: noopEventCallback,
  };

  /* istanbul ignore next: changing default events construction soon */
  public constructor(partial: Partial<ClientConfig>, events?: EventBinding) {
    if (partial.accessToken == null || !validate(partial.accessToken)) {
      throw new Error(`${partial?.accessToken} is not a valid UUID.`);
    }
    this.accessToken = partial.accessToken;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.iFrameConfig = new IFrameConfig(partial.iFrameConfig);

    Object.values(EventName).forEach((eventName) => {
      if (events?.[eventName] != null) {
        this.eventBinding[eventName] = events?.[eventName];
      }
    });

    this.protectClientUrl =
      partial?.protectClientUrl || ClientConfig.DEBUG ? ClientConfig.PROTECT_TEST_URL : ClientConfig.PROTECT_PROD_URL;

    Object.freeze(this);
  }

  public get protectClientLogEndpoint(): URL {
    return new URL(`${this.protectClientUrl}/api/util/log-client-error`);
  }

  /**
   * Constructs the URL for the IFrame which represents the Protect Client
   *
   * @param accessToken - optional UUID to override the original access token.
   */
  public getIFrameUrl = (accessToken: string | undefined = undefined): string => {
    const token = accessToken || this.accessToken;
    if (!validate(token)) throw new Error(`An access token UUID is required. ${token} is not a valid access token.`);
    return `${this.protectClientUrl}?accessToken=${token}&noredirect=1`;
  };
}

/**
 * Configuration options for rendering the Client
 */
export class IFrameConfig {
  /**
   * An array of CSS class names to attach to.
   * In Magento, this was `['ns8-protect-client-iframe']`
   */
  public classNames: string[];

  /**
   * The ID of the root DOM node to which the Client is attached.
   * In Magento, this was `'ns8-protect-wrapper'`
   */
  public attachToId: string;

  public constructor(partial?: Partial<IFrameConfig>) {
    /* istanbul ignore next: changing default events construction soon */
    this.classNames = partial?.classNames || []; // FIXME: validate
    /* istanbul ignore next: changing default events construction soon */
    this.attachToId = partial?.attachToId || ''; // FIXME: validate
  }
}
