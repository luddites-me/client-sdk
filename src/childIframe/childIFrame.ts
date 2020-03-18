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
  onReady: () => void;
  heightCalculationMethod: () => number | undefined;
}

interface ParentIFrame {
  sendMessage: (message: CrossDomainMessage, targetOrigin?: string) => void;
  getPageInfo: (callback: (pageInfo: ParentPageInfo) => void) => void;
}

export interface CustomWindow extends Window {
  [LAST_PAGE_INFO_GLOBAL]?: ParentPageInfo;
  iFrameResizer?: ResizerConfig;
  parentIFrame?: ParentIFrame | undefined;
}

declare let window: CustomWindow;

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

export function initIFrame(container: Element, globalWindow: CustomWindow): void {
  // eslint-disable-next-line no-unused-expressions
  iframeResizerContentWindow; // required to prevent tree-shaking the iframed-window dependency
  // eslint-disable-next-line no-param-reassign
  globalWindow.iFrameResizer = {
    /**
     * We want the height of the iframe to be large enough to hold the content on the iframe,
     * and also extend to the bottom of the containing window at a minimum to ensure we also
     * have enough space to display a modal (assuming there's enough space in the containing
     * window).
     */
    heightCalculationMethod: (): number => {
      const { height } = container.getBoundingClientRect();
      return Math.max(height, getCurrentMinIframeHeight(globalWindow));
    },
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
