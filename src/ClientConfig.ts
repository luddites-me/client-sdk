/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import validate from 'uuid-validate';
import { EventBinding, EventNames } from './Events';
/**
 * Configuration options for rendering the Protect Client
 */
export class ClientConfig {
  public static readonly PROTECT_TEST_URL = 'https://test-protect-client.ns8.com';

  public static readonly PROTECT_PROD_URL = 'https://protect-client.ns8.com';

  public constructor(partial?: Partial<ClientConfig>) {
    Object.assign(this, partial || {});
    if (!this.events && !this._events) {
      // We will never reach this condition, because the events getter will initialize the _events object
      /* istanbul ignore next */
      throw new Error('Events cannot be empty');
    }
    Object.freeze(this._events);
  }

  /**
   * This can be set to true to allow more verbose options when debugging.
   */
  public static DEBUG = false;

  /**
   * Internal access token to allow for validation on set.
   */
  private _accessToken: string | undefined;

  /**
   * The Protect access token required for authenticating the request to inject the IFrame.
   * This should always be a UUID.
   */
  public get accessToken(): string {
    return this._accessToken || '';
  }

  /**
   * Sets the access token if the value is a valid UUID
   */
  public set accessToken(val) {
    if (!validate(val)) {
      throw new Error(`${val} is not a valid UUID.`);
    }
    this._accessToken = val;
  }

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

  // TODO: allow setting protect-client URL
  /* eslint-disable-next-line class-methods-use-this */
  public get protectClientUrl(): string {
    const urlStr = ClientConfig.DEBUG ? ClientConfig.PROTECT_TEST_URL : ClientConfig.PROTECT_PROD_URL;
    return urlStr.replace(/\/+$/, '');
  }

  public get protectClientLogEndpoint(): URL {
    return new URL(`${this.protectClientUrl}/api/util/log-client-error`);
  }

  /**
   * Configuration options for rendering the Client
   */
  public iFrame!: IFrameConfig;

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
  public constructor(partial?: Partial<IFrameConfig>) {
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
  public attachToId!: string;
}

export interface ProtectClientErrorLogOptions {
  url: string;
  level: log.LogLevelNumbers;
  includeStack: boolean;
}
