/**
 * Responsible for rendering the Protect Client SPA
 */
export interface ProtectClient {
  /**
   * Responsible for initiating page navigation to the Platform's Order detail view
   */
  navigateToPlatformOrder(orderId: string): void;
  /**
   * Initializes the Protect Client SPA in the platform context
   */
  render(): void;
  /**
   * Responsible for sizing the SPA to fit the parent container
   */
  resizeClientToFitView(container: HTMLElement): void;
}

export enum ProtectClientEvents {
  ORDER_DETAIL_NAME_CLICK = 'order-detail-name-click',
}
