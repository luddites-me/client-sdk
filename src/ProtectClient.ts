/**
 * Responsible for rendering the Protect Client SPA
 */
export interface ProtectClient {
  /**
   * Initializes the Protect Client SPA in the platform context
   */
  render(): Promise<any>;

  /**
   * Responsible for sizing the SPA to fit the parent container
   *
   * @param container - The parent DOM node to which the iframe will be attached.
   * @param paddingTop - Padding (in pixels) to add to the top of the iframe. In Magento, this was `'419'`.
   * @param containerHeight - Height of the container. In Magento, this was `calc(100vh - ${container.offsetTop}px - 20px)`.
   */
  resizeClientToFitView(container: HTMLElement, paddingTop: number, containerHeight: string): void;
}
