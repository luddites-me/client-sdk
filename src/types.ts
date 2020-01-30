import { LogLevel } from './logger';

/**
 * The signature for event callbacks.
 * @param data - An arbitrary event object that will be passed in the context of the callback
 */
export type EventCallback = (data: unknown) => Promise<unknown>;

/**
 * Events that can be triggered from the protect client to the parent window
 */
export enum EventName {
  NS8_PROTECT_CLIENT_CONNECTED = 'ns8-protect-client-connected',
  ORDER_DETAIL_NAME_CLICK = 'order-detail-name-click',
}

/**
 * A collection of event callbacks. This represents a simple dictionary where the key is the event name,
 * and the value is a callback which will be executed if that event fires. The keys must map to known
 * EventNames.
 * {@link EventCallback}
 */
export type EventBinding = { [evtName in EventName]: EventCallback };

/**
 * Page routes within the Protect Client SPA
 */
export enum ClientPage {
  DASHBOARD = 'dashboard',
  ORDER_DETAILS = 'order-details',
  ORDER_RULES = 'rules',
  SUSPICIOUS_ORDERS = 'report/suspicious-orders',
}

export interface PartialConfig {
  /**
   * The Protect access token required for authenticating the request to inject the IFrame.
   * This should always be a UUID.
   */
  accessToken: string;

  /**
   * Pass in {@link EventCallback}s for the events you care to subscribe to from the client
   * {@link EventBinding} */
  eventBinding?: Partial<EventBinding>;

  /**
   * A partial {@link IFrameConfig}, with optional `classNames`
   */
  iFrameConfig: {
    attachToId: string;
    classNames?: string[];
  };

  /**
   * The Protect Client base URL
   *
   * This will default to {@link ClientConfig.PROTECT_PROD_URL} unless {@link ClientConfig.DEBUG}
   * is `true`, in which case it defaults to {@link ClientConfig.PROTECT_TEST_URL}
   */
  protectClientUrl?: URL;
}

/**
 * Configuration options for rendering the Client
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFrameConfig {
  /**
   * An array of CSS class names to attach to.
   * In Magento, this was `['ns8-protect-client-iframe']`
   */
  classNames: string[];

  /**
   * The ID of the root DOM node to which the Client is attached.
   * In Magento, this was `'ns8-protect-wrapper'`
   */
  attachToId: string;
}

/**
 * Responsible for rendering the Protect Client SPA
 */
export interface ProtectClient {
  /**
   * Initializes the Protect Client SPA in the platform context
   *
   * @returns A promise which will be resolved when the iFrame is injected successfully.
   */
  render(): Promise<void>;

  /**
   * Manually trigger an event on the client. Useful for testing/debugging.
   *
   * @param eventName - The name of an event registered on the Client.
   * @param data - Optional data to pass into the callback
   *
   * @throws Throws an error if the event name is not registered.
   *
   * @returns The return of the registered event, if any.
   */
  trigger(eventName: EventName, data?: unknown): Promise<unknown>;
}

/**
 * Configuration for the {@link protectLogger}
 */
export interface ProtectClientErrorLogOptions {
  /**
   * Controls the minimum {@link LogLevel} a message needs to have to be logged.
   */
  level: LogLevel;
  /**
   * Controls whether or not a stacktrace is included messages that are sent to
   * the Protect client log API
   */
  includeStack: boolean;
}

export interface ProtectClientIFrameOptions {
  classNames: Array<string>;
  clientUrl: string;
  debug?: boolean;
  containerId: string;
}

export interface iFrameParams {
  src: string;
  classNames: string[];
}

export interface ProtectClientIFrame {
  on(name: string, handler: Function): void;
}
