/**
 * Responsible for rendering the Protect Client SPA
 */
export interface ProtectClient {
  /**
   * Responsible for initiating page navigation to the Platform's Order detail view
   *
   * @param orderId - The platform's Order ID to use for constructing the URL to this order page
   */
  navigateToPlatformOrder(orderId: string): void;

  /**
   * Initializes the Protect Client SPA in the platform context
   */
  render(): void;

  /**
   * Responsible for sizing the SPA to fit the parent container
   *
   * @param container - The parent DOM node to which the iframe will be attached.
   * @param paddingTop - Padding (in pixels) to add to the top of the iframe. In Magento, this was `'419'`.
   * @param containerHeight - Height of the container. In Magento, this was `calc(100vh - ${container.offsetTop}px - 20px)`.
   */
  resizeClientToFitView(container: HTMLElement, paddingTop: number, containerHeight: string): void;
}

/**
 * TODO: Discover the best place to define these constants.
 * These are currently defined as strings inside the `ns8-protect-client` client project.
 */
export enum ProtectClientEvents {
  ORDER_DETAIL_NAME_CLICK = 'order-detail-name-click',
}
