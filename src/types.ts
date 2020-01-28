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
 */
export type EventBinding = { [evtName in EventName]: EventCallback };

export interface PartialConfig {
  /**
   * The Protect access token required for authenticating the request to inject the IFrame.
   * This should always be a UUID.
   */
  accessToken: string;

  eventBinding?: Partial<EventBinding>;

  iFrameConfig: Partial<IFrameConfig>;

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

export interface ProtectClientErrorLogOptions {
  url: string;
  level: LogLevel;
  includeStack: boolean;
}
