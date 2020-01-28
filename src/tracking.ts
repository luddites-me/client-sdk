import fetch from 'cross-fetch';

import { protectLogger } from './logger';

let trackingScript: string;

/**
 * Path to the JS code
 * // FIXME: is this usually in the `test-api-v1` subdomain?
 */
export const TRUE_STATS_URL = 'https://test-api-v1.ns8.com/web';

/**
 * Fetches the tracking script. Caches the script once fetched.
 *
 * @param url - An alternate URL to use for fetching the script
 *
 * @returns Promise with the script content wrapped inside a `<script>`
 */
export const getTrackingScript = async (url: string | null = null): Promise<string> => {
  const trackingUrl = url || TRUE_STATS_URL;
  // If we're asking for the official script AND we have it cached, serve the cached script
  if (trackingUrl === TRUE_STATS_URL && trackingScript) {
    return trackingScript;
  }
  try {
    const res = await fetch(trackingUrl);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const text = await res.text();
    trackingScript = `<script>${text}</script>`;
    return trackingScript;
  } catch (error) {
    const msg = `Failed to get tracking script. ${error.message}`;
    protectLogger.error(msg);
    throw new Error(msg);
  }
};
