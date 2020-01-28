import validate from 'uuid-validate';
import { EventBinding, EventName, IFrameConfig, PartialConfig } from './types';

const noopEventCallback = (): Promise<void> => Promise.resolve();

const createIFrameConfig = (partialConfig: Partial<IFrameConfig>): IFrameConfig => {
  const classNames = partialConfig?.classNames || [];
  if (!Array.isArray(classNames) || classNames.filter((cn) => typeof cn !== 'string').length > 0) {
    throw new Error('iFrameConfig.classNames must be an array of strings');
  }
  const attachToId = partialConfig?.attachToId;
  if (typeof attachToId !== 'string') {
    throw new Error('iFrameConfig.attachToId must be a string');
  }
  return Object.freeze({ attachToId, classNames });
};

export class ClientConfig {
  public static readonly PROTECT_TEST_URL = new URL('https://test-protect-client.ns8.com');

  public static readonly PROTECT_PROD_URL = new URL('https://protect-client.ns8.com');

  /**
   * This can be set to true to allow more verbose options when debugging.
   */
  public static DEBUG = false;

  public accessToken: string;

  public iFrameConfig: IFrameConfig;

  public protectClientUrl: URL;

  public eventBinding: EventBinding = {
    [EventName.NS8_PROTECT_CLIENT_CONNECTED]: noopEventCallback,
    [EventName.ORDER_DETAIL_NAME_CLICK]: noopEventCallback,
  };

  public constructor(partial: PartialConfig) {
    this.accessToken = partial.accessToken;
    if (this.accessToken == null || !validate(this.accessToken)) {
      throw new Error(`An access token UUID is required. '${this.accessToken}' is not a valid access token.`);
    }

    this.iFrameConfig = createIFrameConfig(partial.iFrameConfig);

    Object.values(EventName).forEach((eventName) => {
      /* istanbul ignore next: optional chaining */
      const binding = partial.eventBinding?.[eventName];
      if (binding != null) {
        this.eventBinding[eventName] = binding;
      }
    });

    this.protectClientUrl =
      partial.protectClientUrl || (ClientConfig.DEBUG ? ClientConfig.PROTECT_TEST_URL : ClientConfig.PROTECT_PROD_URL);

    Object.freeze(this);
  }
}
