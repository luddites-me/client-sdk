/**
 * Configuration options for rendering the Protect Client
 */
export class ClientConfig {
  public constructor(partial?: Partial<ClientConfig>) {
    Object.assign(this, partial || {});
  }

  /**
   * An array of CSS class names to attach to.
   * In Magento, this was `['ns8-protect-client-iframe']`
   */
  public classNames!: string[];

  /**
   * The URL for the Client API (Middleware)
   */
  public clientApi!: string;

  /**
   * The ID of the root DOM node to which the Client is attached.
   * In Magento, this was `'ns8-protect-wrapper'`
   */
  public clientContainerId!: string;

  /**
   * The height to set the client iframe.
   * In Magento, this was `calc(100vh - ${container.offsetTop}px - 20px)`
   */
  public clientHeight!: string;

  /**
   * Padding (in pixels) to add to the top of the container.
   * In Magento, this was `419`.
   */
  public clientPaddingTop!: number;

  /**
   * The ID of the root DOM node to which an order.
   * In Magento, this was `'sales_order_view_tabs_ns8_protect_order_review_content'`
   */
  public orderContainerId!: string;

  /**
   * The base url of the order detail view for the platform.
   * In Magento, this was ~ `/sales/order/view/order_id/{orderId}`
   */
  public platformOrderBaseUrl!: string;
}