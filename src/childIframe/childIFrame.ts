/* eslint-disable

  spaced-comment,
  @typescript-eslint/triple-slash-reference

*/

/// <reference path="./iframe-resizer.d.ts" />

import { iframeResizerContentWindow } from 'iframe-resizer';
import {
  CrossDomainMessage,
  EventName,
  IFRAME_PAGE_INFO_EVENT_NAME,
  LAST_PAGE_INFO_GLOBAL,
  ParentPageInfo,
} from '../types';

interface ResizerConfig {
  /**
   * Function to call when the contained page code has been loaded and initialized.
   */
  onReady: () => void;

  /**
   * Function to override the standard height calculation of the iframe
   * on Dom changes.
   *
   * @returns the height of the iframe or undefined.
   */
  heightCalculationMethod: () => number | undefined;
}

interface ParentIFrame {
  /**
   * Sends a message {@link CrossDomainMessage} to the containing page.
   *
   * @param CrossDomainMessage - message to be sent to the containing page.
   * @param targetOrigin - an optional origin to specify, restricting the domain to which the
   * message can be sent.
   */
  sendMessage: (message: CrossDomainMessage, targetOrigin?: string) => void;

  /**
   * getPageInfo asks the containing page for its positioning coordinates.
   * @param callback - called when the parent page is scrolled or resized.
   */
  getPageInfo: (callback: (pageInfo: ParentPageInfo) => void) => void;
}

/**
 * Custom Window extends the global DOM window object to include optional global iframe-resizer
 * properties and the containing page {@link ParentPageInfo} properties.
 */
export interface CustomWindow extends Window {
  /**
   * page information from the containing page
   */
  [LAST_PAGE_INFO_GLOBAL]?: ParentPageInfo;
  /**
   * Configuration object for the iframe resizer child instance.
   */
  iFrameResizer?: ResizerConfig;

  /**
   * global object used to communicate with the iframe parent
   */
  parentIFrame?: ParentIFrame | undefined;
}

declare let window: CustomWindow;

/**
 * Gets the height of the iframe's containing window or a default value large enough
 * to contain a modal.
 *
 * @param globalWindow - the global window, augmented with iframeResizer-specific properties
 * @returns the height of the iframe's containing window.
 */
export const getCurrentMinIframeHeight = (globalWindow: CustomWindow): number => {
  const DEFAULT_IFRAME_HEIGHT = 600;
  const pageInfo: ParentPageInfo | undefined = globalWindow[LAST_PAGE_INFO_GLOBAL];
  if (pageInfo == null) {
    return DEFAULT_IFRAME_HEIGHT;
  }
  const { scrollTop, offsetTop, windowHeight } = pageInfo;
  const distFrmTopToWinTop = offsetTop - scrollTop;
  return windowHeight - distFrmTopToWinTop;
};

/**
 * initialize the iframe using the iframe-resizer library, with an initial minimum height sufficient
 * to display a modal.
 *
 * @param container - an {@link Element} used as the container for the iframe
 * @param globalWindow - the {@link Window} object where we bind the iframe resizer config
 * that iframeResizerContent window uses on load to initialize the child iframe library code.
 */

export function initIFrame(container: Element, globalWindow: CustomWindow): void {
  /**
   * The iframeResizerContentWindow handles messaging from the contained application to the
   * containing application.
   *
   * Instead of including it in a script tag, we reference it here to activate it globally while
   * preventing it from being tree-shaken.
   */

  // eslint-disable-next-line no-unused-expressions
  iframeResizerContentWindow;
  // eslint-disable-next-line no-param-reassign
  globalWindow.iFrameResizer = {
    /**
     * We want the height of the iframe to be large enough to hold the content on the iframe,
     * and also extend to the bottom of the containing window at a minimum to ensure we also
     * have enough space to display a modal (assuming there's enough space in the containing
     * window).
     *
     * @returns the height of the iframe's containing window or the minimum height required
     * to display a modal.
     */
    heightCalculationMethod: (): number => {
      const { height } = container.getBoundingClientRect();
      return Math.max(height, getCurrentMinIframeHeight(globalWindow));
    },

    /**
     * Alert parent that the protect app is connected. Bind 'order-detail-name-click' event listener,
     * so the parent can then handle the transition to the order details view.
     */
    onReady: (): void => {
      const parent = globalWindow.parentIFrame;
      if (parent == null) {
        throw new Error('`onReady()` called, but `parentIFrame == null`');
      }
      // istanbul ignore next
      parent.sendMessage({ name: EventName.NS8_PROTECT_CLIENT_CONNECTED });
      // istanbul ignore next
      globalWindow.document.addEventListener(EventName.ORDER_DETAIL_NAME_CLICK, ((e: CustomEvent) => {
        // istanbul ignore next
        if (parent) {
          parent.sendMessage({
            name: EventName.ORDER_DETAIL_NAME_CLICK,
            data: e.detail,
          });
        }
      }) as EventListener);

      // istanbul ignore next
      parent.getPageInfo((pageInfo: ParentPageInfo): void => {
        // eslint-disable-next-line no-param-reassign
        globalWindow[LAST_PAGE_INFO_GLOBAL] = pageInfo;
        globalWindow.document.dispatchEvent(
          new CustomEvent(IFRAME_PAGE_INFO_EVENT_NAME, {
            detail: { pageInfo },
            bubbles: false,
          }),
        );
      });
    },
  };
}
