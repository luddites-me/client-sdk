/**
 * The signature for event callbacks.
 * @param data - An arbitrary event object that will be passed in the context of the callback
 */
export type EventCallback = (data: any) => Promise<any>;

/**
 * TODO: Discover the best place to define these constants.
 * These are currently defined as strings inside the `ns8-protect-client` client project.
 */
export enum EventNames {
  NS8_PROTECT_CLIENT_CONNECTED = 'ns8-protect-client-connected',
  ORDER_DETAIL_NAME_CLICK = 'order-detail-name-click',
}

/**
 * A collection of event bindings. This represents a simple dictionary where the key is the event name,
 * and the value is a callback which will be executed if that event fires. The keys must map to known
 * EventNames.
 */
export interface EventBinding {
  [key: string]: EventCallback;
}
