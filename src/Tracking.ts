/* eslint-disable no-underscore-dangle */
// import https from 'https';
import fetch from 'node-fetch';

/**
 * Simple utility class for fetching the tracking script
 */
export class Tracking {
  private static _trackingScript: string;

  /**
   * Path to the JS code
   */
  public static readonly TRUE_STATS_URL = 'https://test-api-v1.ns8.com/web';

  /**
   * Fetches the tracking script. Caches the script once fetched.
   *
   * @param url - An alternate URL to use for fetching the script
   *
   * @returns Promise with the script content wrapped inside a `<script>`
   */
  public static getTrackingScript = async (url: string | null = null): Promise<string> => {
    const trackingUrl = url || Tracking.TRUE_STATS_URL;
    // If we're asking for the official script AND we have it cached, serve the cached script
    if (trackingUrl === Tracking.TRUE_STATS_URL && Tracking._trackingScript) {
      return Tracking._trackingScript;
    }
    try {
      const res = await fetch(trackingUrl);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const text = await res.text();
      Tracking._trackingScript = `<script>${text}</script>`;
      return Tracking._trackingScript;
    } catch (error) {
      throw new Error(`Failed to get tracking script. ${error.message}`);
    }
  };
}
