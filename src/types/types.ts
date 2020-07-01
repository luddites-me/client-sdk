/* eslint-disable */
import { LogLevel } from "../logger/logger";

/**
 * Custom event to fire for childiFrame logic to call
 * @public
 */
export const IFRAME_PAGE_INFO_EVENT_NAME = "iframe-resize-page-info";

/**
 * Constant referencing based off of the last page
 * @public
 */
export const LAST_PAGE_INFO_GLOBAL = "__latestIframePageInfo";

/**
 * Attributes of the parent page
 * @public
 */
export interface ParentPageInfo {
  /**
   * The height of the iframe in pixels
   */
  iframeHeight: number;
  /**
   * The width of the iframe in pixels
   */
  iframeWidth: number;
  /**
   * The number of pixels between the left edge of the containing page and the left edge of the iframe
   */
  offsetLeft: number;
  /**
   * The number of pixels between the top edge of the containing page and the top edge of the iframe
   */
  offsetTop: number;
  /**
   * The number of pixels between the left edge of the iframe and the left edge of the iframe viewport
   */
  scrollLeft: number;
  /**
   * The number of pixels between the top edge of the iframe and the top edge of the iframe viewport
   */
  scrollTop: number;
  /**
   * The containing document's height in pixels (the equivalent of document.documentElement.clientHeight
   * in the container)
   */
  documentHeight: number;
  /**
   * The containing document's width in pixels (the equivalent of document.documentElement.clientWidth
   * in the container)
   */
  documentWidth: number;
  /**
   * The containing window's height in pixels (the equivalent of window.innerHeight in the container)
   */
  windowHeight: number;
  /**
   * The containing window's width in pixels (the equivalent of window.innerWidth in the container)
   */
  windowWidth: number;
}

/**
 * The signature for event callbacks.
 * @param data - An arbitrary event object that will be passed in the context of the callback
 * @public
 */
export type EventCallback = (data: unknown) => Promise<unknown>;

/**
 * Events that can be triggered from the protect client to the parent window
 * @public
 */
export enum EventName {
  NS8_PROTECT_CLIENT_CONNECTED = "ns8-protect-client-connected",
  ORDER_DETAIL_NAME_CLICK = "order-detail-name-click",
}

/**
 * A collection of event callbacks. This represents a simple dictionary where the key is the event name,
 * and the value is a callback which will be executed if that event fires. The keys must map to known
 * EventNames.
 * {@link EventCallback}
 * @public
 */
export type EventBinding = { [evtName in EventName]: EventCallback };

/**
 * Page routes within the Protect Client SPA
 * @public
 */
export enum ClientPage {
  CAMPAIGN_ACTIVITY = "CAMPAIGN_ACTIVITY",
  DASHBOARD = "DASHBOARD",
  MONITORS = "MONITORS",
  ORDER_DETAILS = "ORDER_DETAILS",
  ORDER_RULES = "ORDER_RULES",
  SUSPICIOUS_ORDERS = "SUSPICIOUS_ORDERS",
}

/**
 * Interface representing partial config data for the SDK
 * @public
 */
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
 * @public
 */
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
 * The shared message interface for cross-domain iframe messages sent via iframe-resizer.
 * @public
 */
export type CrossDomainMessage = { name: string; data?: unknown };

/**
 * Responsible for rendering the Protect Client SPA
 * @public
 */
export interface ProtectClient {
  /**
   * Initializes the Protect Client SPA in the platform context
   *
   * @param page - The {@link ClientPage} to navigate to, defaults to {@link ClientPage.DASHBOARD}
   * @param platformId - The platform orderId to show iff page is {@link ClientPage.ORDER_DETAILS}
   * @param overrideHideNavBar - Explicitly show/hide the nav bar instead of using default based on `page`
   * @returns A promise which will be resolved when the iFrame is injected successfully.
   */
  render(
    page?: ClientPage,
    platformId?: string,
    overrideHideNavBar?: boolean
  ): Promise<void>;

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
 * @public
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
