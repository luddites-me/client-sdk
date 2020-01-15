/* eslint-disable global-require */

/**
 * This will load the `.env` file onto the current process.
 * Missing properties will be loaded from `.env.defaults` if possible.
 * If no defaults exist and the properties are defined in `.env.schema`,
 * but are missing from `.env`, an error will be thrown with the missing
 * property name.
 */
import dotEnvExtended from 'dotenv-extended';

export const env = dotEnvExtended.load({
  encoding: 'utf8',
  silent: true,
  path: '.env',
  defaults: '.env.defaults',
  schema: '.env.schema',
  errorOnMissing: true,
  errorOnExtra: false,
  errorOnRegex: false,
  includeProcessEnv: false,
  assignToProcessEnv: true,
  overrideProcessEnv: false,
});

export const isDev = (): boolean => {
  if (!env || !env.NODE_ENV) return false;
  if (
    !env.NODE_ENV.toLowerCase()
      .trim()
      .startsWith('prod')
  ) {
    return true;
  }
  return false;
};
