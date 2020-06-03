# Protect Client Documentation

## Table of Contents

- [Protect Client Documentation](#protect-client-documentation)
  - [Purpose of the Protect Client](#purpose-of-the-protect-client)
  - [Configuration](#configuration)
  - [Example Protect Client Implementations](#example-protect-client-implementations)

## Purpose of the Protect Client

The purpose of the Action Client is to render the NS8 Protect Client SPA in an iframe within a Platform (e.g. Shopify, Magento, BigCommerc, etc), attach/repond to events and match the platform styles.
Goals:

- Render the Protect application for display/interaction
- Size the client correctly
- Handle navigation and browser events (e.g. resizing)
- Event bus for communication between the client and the platform

## Configuration

The Protect Client requires a minimal amount of configuration in order to render on the platform. This requires instantiating the `Client` class with a `ClientConfig` object. This defines:

- `accessToken`: your NS8 Protect access token used for authenticating API calls to Protect. This is required for loading the IFrame.
- `eventBinding`: a collection of events to which you will bind. The `EventName` enum defines static events which are guaranteed to execute.
- `IFrameConfig`: an object representing the configuration of the IFrame that Protect will occupy. `attachToId` is required, and `classNames` is optional.

## Example Protect Client Implementations

The following serve as examples of implementation of the Client to demonstrate intended uses:

```typescript
import { createClient, ClientConfig, ClientPage, EventName, EventBinding, IFrameConfig } from '@ns8/protect-sdk-client';
const accessToken = '27802062-34c4-450c-a18f-667324f14375';
const eventBinding: EventBinding = {
  // Define a response to this event that will navigate the user from Protect back to the Platform order page
  [EventName.ORDER_DETAIL_NAME_CLICK]: (data: unknown): Promise<unknown> => {
    const { orderId } = data;
    const orderUrl = `https://www.my-magento-store.com/index.php/admin_demo/sales/order/view/order_id/${orderId}`;
    window.location.href = orderUrl;
    return Promise.resolve();
  },
};
const iFrameConfig: {
  classNames: ['ns8-protect-client-iframe'];
  attachToId: 'ns8-protect-wrapper';
};
// Instantiate the client with all of the platform specific options
const protectClient = createClient(new ClientConfig({ accessToken, eventBinding, iFrameConfig }));
// Render the client in an iframe and attach to all events. Returns a promise which resolves when the client is ready.
const clientReady = protectClient.render(ClientPage.DASHBOARD);
```
