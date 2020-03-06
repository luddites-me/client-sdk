import log from 'loglevel';
import fetch from 'cross-fetch';
import format from 'format-util';
import stacktrace from 'stacktrace-js';

import { ProtectClientErrorLogOptions } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConsoleLogArgs = any[];

const sendQueue: string[] = [];
let sendPromise: Promise<void> | null = null;
let protectClientErrorLogOptions: (ProtectClientErrorLogOptions & { url: URL }) | null = null;

const getStack = async (includeStack: boolean): Promise<string> => {
  const stackFrames = includeStack ? await stacktrace.get() : [];
  return stackFrames
    .filter((frame) => frame.fileName !== stackFrames[0].fileName)
    .map((frame) => `  at ${frame.functionName} (${frame.fileName}:${frame.lineNumber}:${frame.columnNumber})`)
    .join('\n');
};

const sendNextMessage = (errString: string): Promise<void> => {
  /* istanbul ignore next */
  if (protectClientErrorLogOptions == null) return Promise.resolve();

  const { includeStack, url } = protectClientErrorLogOptions;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const voidFunc = (): void => {}; // swallow any `fetch` errors
  return getStack(includeStack)
    .then((stackTrace) =>
      fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errString, stackTrace }),
      }),
    )
    .then(voidFunc)
    .catch(voidFunc);
};

const sendMessages = async (): Promise<void> => {
  if (sendPromise != null) return;
  sendPromise = (async (): Promise<void> => {
    while (sendQueue.length > 0) {
      const msg = sendQueue.shift();
      /* istanbul ignore next */
      if (msg != null) {
        // eslint-disable-next-line no-await-in-loop
        await sendNextMessage(msg);
      }
    }
  })();

  await sendPromise;
  sendPromise = null;
};

const pushMessage = (message: ConsoleLogArgs): void => {
  try {
    const [formatStr, ...optionalArguments] = message;
    sendQueue.push(format(formatStr, ...optionalArguments));
    /* eslint-disable-next-line no-empty */
  } catch (error) {
    /* swallow any `formatStr` errors */
  }
  sendMessages();
};

/**
 * Configure a {@link log.Logger} to forward messages to the Protect client log API
 *
 * This method is internal only; clients use {@link logger.configureProtectLogger},
 * which calls this.
 *
 * @param logger - the logger to configure (usually, {@link logger.protectLogger}, except in testing
 * @param url - the URL of the protect client API endpoint to send messages to
 * @param options - specifies minimum logLevel and whether stack traces should be included
 */
export const configureLogger = (logger: log.Logger, url: URL, options: ProtectClientErrorLogOptions): void => {
  if (!logger || !logger.methodFactory)
    throw new Error('loglevel instance has to be specified in order to be extended');

  const wrappedFactory = logger.methodFactory;
  const methodFactory: log.MethodFactory = (methodName, logLevel, loggerName) => {
    const wrappedMethod = wrappedFactory(methodName, logLevel, loggerName);
    const loggingMethod: log.LoggingMethod = (...message: ConsoleLogArgs) => {
      wrappedMethod(...message);
      // It's important that `pushMessage` does not throw or result in unhandled rejections;
      // the implementation should just swallow all errors
      pushMessage(message);
    };
    return loggingMethod;
  };

  protectClientErrorLogOptions = { ...options, url };

  /* eslint-disable-next-line no-param-reassign */
  logger.methodFactory = methodFactory;
  // call setLevel method in order to apply plugin
  logger.setLevel(options.level);
};

/**
 * This just makes the internal `sendPromise` available to test scripts so that
 * it can be `await`ed, to verify that things were called
 */
export const getCurrentErrorLogRequestPromise = (): Promise<void> | null => sendPromise;
