import validate from 'uuid-validate';
import { EventBinding, EventCallback, EventName, IFrameConfig, PartialConfig } from '../types/types';

/**
 * The default callback for all events
 * {@link EventCallback}
 */
const noopEventCallback: EventCallback = (): Promise<void> => Promise.resolve();

/**
 * Create a complete {@link IFrameConfig} from a `Partial<IFrameConfig>`.
 * All values are validated and any omitted values are kept to their defaults.
 * @param partialConfig - The values to populate the config with
 */
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

/**
 * All configuration values for a {@link ProtectClient}.
 */
export class ClientConfig implements PartialConfig {
  public static readonly PROTECT_TEST_URL = new URL('https://test-protect-client.luddites.me');

  public static readonly PROTECT_PROD_URL = new URL('https://protect-client.luddites.me');

  /**
   * This can be set to true to allow more verbose options when debugging.
   */
  public static DEBUG = false;

  /** {@inheritdoc} */
  public accessToken: string;

  /** {@link IFrameConfig} */
  public iFrameConfig: IFrameConfig;

  /** {@inheritdoc} */
  public protectClientUrl: URL;

  /** {@link EventBinding} */
  public eventBinding: EventBinding = {
    [EventName.LUDDITES_PROTECT_CLIENT_CONNECTED]: noopEventCallback,
    [EventName.ORDER_DETAIL_NAME_CLICK]: noopEventCallback,
  };

  /**
   * Create a complete {@link ClientConfig} from a {@link PartialConfig}.
   * All values are validated and any omitted values are kept to their defaults.
   *
   * @remarks
   * Since this is called from JS clients, we don't assume that the parameters are
   * checked at compile time as they would be with typescript, so we check that the
   * values have the expected type/shape at runtime.
   *
   * @param partial - The values to populate the config with
   */
  public constructor(partial: PartialConfig) {
    this.accessToken = partial.accessToken;
    if (!validate(this.accessToken)) {
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

    if (partial.protectClientUrl != null) {
      this.protectClientUrl = new URL(partial.protectClientUrl.toString());
    } else {
      this.protectClientUrl = ClientConfig.DEBUG ? ClientConfig.PROTECT_TEST_URL : ClientConfig.PROTECT_PROD_URL;
    }

    if (this.protectClientUrl.pathname !== '/') {
      throw new Error('custom `protectClientUrl` must have `pathname === "/"`');
    }

    Object.freeze(this);
  }
}
