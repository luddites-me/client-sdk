import log from 'loglevel';

import { ClientConfig } from '../config/clientConfig';
import { configureLogger } from '../internal/loglevelExtension';
import { ProtectClientErrorLogOptions } from '../types/types';

/**
 * Log levels for statements entering the log
 *
 * @public
 */
export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

interface Logger {
  /**
   * Output debug message to console
   */
  debug: (...msg: unknown[]) => void;

  /**
   * Output info message to console
   */
  info: (...msg: unknown[]) => void;

  /**
   * Output warn message to console
   */
  warn: (...msg: unknown[]) => void;

  /**
   * Output error message to console
   */
  error: (...msg: unknown[]) => void;
}

/* eslint-disable prefer-destructuring */

/**
 * This gets you a new logger object that works exactly like the root log object, but can have its level and
 * logging methods set independently.
 *
 * @remarks
 * All loggers must have a name (which is a non-empty string). Calling
 * getLogger() multiple times with the same name will return an identical logger object.
 * In large applications, it can be incredibly useful to turn logging on and off for particular modules as you are
 * working with them. Using the getLogger() method lets you create a separate logger for each part of your
 * application with its own logging level. Likewise, for small, independent modules, using a named logger instead
 * of the default root logger allows developers using your module to selectively turn on deep, trace-level logging
 * when trying to debug problems, while logging only errors or silencing logging altogether under normal
 * circumstances.
 * @param name - The name of the produced logger
 *
 * @public
 */
export const getLogger: (name: string) => Logger = log.getLogger;

/**
 * get a dictionary of all loggers created with getLogger, keyed off of their names.
 *
 * @public
 */
export const getLoggers: () => { [name: string]: Logger } = log.getLoggers;

const PROTECT_LOGGER_NAME = 'protect';

/**
 * This is may configured to send log messages to the Protect client log API.
 *
 * @internal
 */
export const protectLogger = getLogger(PROTECT_LOGGER_NAME);

/**
 * Configures {@link protectLogger} to send log messages to the Protect client log API
 * {@link ProtectClientErrorLogOptions}
 *
 * @param options - Configuration for the {@link Logger}
 * @param clientConfig - Used to set the endpoint for the Protect client log API
 *
 * @internal
 */
export const configureProtectLogger = (options: ProtectClientErrorLogOptions, clientConfig: ClientConfig): void => {
  const url = new URL(`${clientConfig.protectClientUrl}/api/util/log-client-error`);
  configureLogger(log.getLogger(PROTECT_LOGGER_NAME), url, options);
};
