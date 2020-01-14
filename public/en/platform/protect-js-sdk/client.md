# Protect Client Documentation

## Purpose of the Protect Client

The purpose of the Action Client is to render the NS8 Protect Client SPA in an iframe within a Platform (e.g. Shopify, Magento, BigCommerc, etc), attach/repond to events and match the platform styles.

Goals:

* Render the Protect application for display/interaction
* Size the client correctly
* Handle navigation and browser events (e.g. resizing)
* Event bus for communication between the client and the platform

## Example Protect Client Implementations

The following serve as examples of implementation of the Client to demonstrate intended uses:

```typescript
import Client from '@ns8/protect-js-sdk';

// Instantiate the client with all of the platform specific options
const protectClient = new Client({
  api: {
    clientApi: 'https://protect-client.ns8.com',
    platformOrderBaseUrl: '/sales/order/view/order_id/',
  },
  page: {
    classNames: ['ns8-protect-client-iframe'],
    clientContainerId: 'ns8-protect-wrapper',
    clientHeight: `calc(100vh - ${container.offsetTop}px - 20px)`,
    clientPaddingTop: 419,
    orderContainerId: 'sales_order_view_tabs_ns8_protect_order_review_content',
  },
});
// Render the client in an iframe and attach to all events
protectClient.render();
```
