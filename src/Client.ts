/* eslint-disable
    @typescript-eslint/no-explicit-any,
    import/prefer-default-export,
    no-param-reassign,
*/
import { ClientConfig } from './ClientConfig';
import { ProtectClient, ProtectClientEvents } from './ProtectClient';

const Postmate = require('postmate').default;

/**
 * Responsible for rendering the Protect Client SPA
 */
export class Client implements ProtectClient {
  /**
   * Configuration for DOM ids and CSS names
   */
  private readonly config: ClientConfig;

  /**
   *
   * @param config - Configuration object that defines the IDs and names to be fetched from the DOM
   */
  public constructor(partial?: Partial<ClientConfig>) {
    this.config = new ClientConfig(partial);
  }

  // @inheritdoc
  public render = (): void => {
    const container: HTMLElement | null = document.getElementById(this.config.page.clientContainerId);
    if (!container) throw new Error(`Could not find element named "${this.config.page.clientContainerId}"`);

    const handshake = new Postmate({
      container,
      url: this.config.api.clientApiUrl,
      classListArray: this.config.page.classNames,
    });

    this.resizeClientToFitView(container, this.config.page.clientPaddingTop, this.config.page.clientHeight);

    handshake.then((child: any) => {
      child.on(ProtectClientEvents.ORDER_DETAIL_NAME_CLICK, (data: any) => this.navigateToPlatformOrder(data.orderId));
    });
  };

  // @inheritdoc
  public navigateToPlatformOrder = (orderId: string): void => {
    const orderUrl = `${this.config.api.platformOrderBaseUrl}/${orderId}`;
    window.location.href = orderUrl;
  };

  // @inheritdoc
  public resizeClientToFitView = (container: HTMLElement, paddingTop: number, containerHeight: string): void => {
    /*
     * Here, we have a few options for keeping the viewport height full of an element
     * 1. Listen for window.onresize
     *    - This may not account for changes in content height caused by the platform
     * 2. Use window.requestAnimationFrame
     *    - This seems like overkill given that we don't really need 60Hz for a iframe height change
     * 3. Poll every so often and run the function to fill the viewport height
     *    - We've gone with this approach using a 200ms interval for now
     */
    const salesOrderContainerElement: HTMLElement | null = document.getElementById(this.config.page.orderContainerId);
    if (salesOrderContainerElement) {
      container.style.paddingTop = `${paddingTop}px`;
      return;
    }
    container.style.height = containerHeight;
  };
}
