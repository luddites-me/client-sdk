# Protect Client Documentation

## Purpose of the Protect Client

The purpose of the Action Client is to render the NS8 Protect Client SPA in an iframe within a Platform (e.g. Shopify, Magento, BigCommerc, etc), attach/repond to events and match the platform styles.

Goals:

* Render the Protect application for display/interaction
* Size the client correctly
* Handle navigation and browser events (e.g. resizing)
* Event bus for communication between the client and the platform

## Configuration

The Protect Client requires a minimal amount of configuration in order to render on the platform. This requires instantiating the `Client` class with a `ClientConfig` object. This defines:

* `accessToken`: your NS8 Protect access token used for authenticating API calls to Protect. This is required for loading the IFrame.
* `events`: a collection of events to which you will bind. The `EventNames` enum defines static events which are guaranteed to execute. All other events are defined, subscribed and published by you.
* `iFrame`: an object representing the configuration of the IFrame that Protect will occupy. `attachToId` is required, and `classNames` is optional.

## Example Protect Client Implementations

The following serve as examples of implementation of the Client to demonstrate intended uses:

```typescript
import Client from '@ns8/protect-sdk-client';

// Instantiate the client with all of the platform specific options
const protectClient = new Client({
  accessToken: '27802062-34c4-450c-a18f-667324f14375',
  events: {
    // Define a response to this event that will navigate the user from Protect back to the Platform order page
    'order-detail-name-click': (data: any): Promise<any> => {
      const orderId = data.orderId;
      const orderUrl = `https://www.my-magento-store.com/index.php/admin_demo/sales/order/view/order_id/${orderId}`;
      window.location.href = orderUrl;
    },
  },
  iFrame: {
    classNames: ['ns8-protect-client-iframe'],
    attachToId: 'ns8-protect-wrapper',
  },
});
// Render the client in an iframe and attach to all events. Returns a promise which resolves when the client is ready.
const clientReady = protectClient.render();
```
