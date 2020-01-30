/* eslint-disable-next-line no-unused-vars */
import { iFrameResize } from 'iframe-resizer';
import { ProtectClientIFrame, ProtectClientIFrameOptions, iFrameParams } from './types';

interface CustomWindow extends Window {
  iFrameResize?: Function;
}

interface ProtectClientEvent {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

declare let window: CustomWindow;

const createIFrame = ({ classNames, src }: iFrameParams): HTMLElement => {
  const _iframe = document.createElement('iframe');
  for (const className of classNames) {
    _iframe.classList.add(className);
  }
  _iframe.src = src.toString();
  return _iframe;
};

export class IFrame implements ProtectClientIFrame {
  private iframeResize: Function | undefined;

  private events: Map<string, Function> = new Map();

  private iFrameClassName = 'ns8-protect-client-iframe';

  constructor(options: ProtectClientIFrameOptions) {
    // bind events to the iframe
    const container: HTMLElement | null = document.getElementById(options.containerId);
    if (!container) {
      throw new Error(`Could not find element named "${options.containerId}"`);
    }

    container.append(
      createIFrame({
        src: options.clientUrl,
        classNames: options.classNames,
      }),
    );

    // q: how to get around '!' ?
    this.iframeResize = window.iFrameResize!(
      {
        heightCalculationMethod: 'lowestElement',
        onInit(iframe: HTMLElement) {
          return 42;
        },
        onMessage({ name, data }: ProtectClientEvent) {
          const handler = this.events.get(name);
          if (typeof handler === 'function') {
            handler(data);
          }
        },
      },
      this.iFrameClassName,
    );
  }

  on(eventName: string, handler: Function): void {
    // this registers events that get called by onMessage to call
    if (this.events.get(eventName)) {
      throw new Error(`event ${eventName} has already been registered`);
    }
    this.events.set(eventName, handler);
  }
}
