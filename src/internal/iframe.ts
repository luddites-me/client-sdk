import 'iframe-resizer';

import { EventBinding, EventCallback, EventName } from '../types';

interface CustomWindow extends Window {
  iFrameResize: Function;
}

declare let window: CustomWindow;

const iFrameClassName = 'ns8-protect-client-iframe';

export interface ProtectClientIFrameOptions {
  classNames: string[];
  clientUrl: string;
  debug?: boolean;
  containerId: string;
  eventBinding: EventBinding;
}

export const createIFrame = ({
  containerId,
  classNames,
  clientUrl,
  eventBinding,
}: ProtectClientIFrameOptions): void => {
  const container: HTMLElement | null = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Could not find element named "${containerId}"`);
  }

  const iframeEl = document.createElement('iframe');
  iframeEl.classList.add(iFrameClassName);
  classNames.forEach((cn) => iframeEl.classList.add(cn));
  iframeEl.src = clientUrl;
  container.append(iframeEl);

  window.iFrameResize(
    {
      tolerance: 5,
      checkorigin: false,
      onMessage: ({ message }: { message: { name?: string; data: unknown } }) => {
        if (message == null) {
          // TODO: log
          return;
        }
        const { name, data } = message;
        const handler: EventCallback | undefined = eventBinding[name as EventName];
        if (handler == null) {
          // TODO: log
          return;
        }
        handler(data);
      },
      onResized: ({ height }: { height: string }) => {
        iframeEl.style.height = `${height}px`;
      },
    },
    `.${iFrameClassName}`,
  );
};
