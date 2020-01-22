/**
 * Responsible for rendering the Protect Client SPA
 */
export interface ProtectClient {
  /**
   * Initializes the Protect Client SPA in the platform context
   *
   * @returns A promise which will be resolved when the iFrame is injected successfully.
   */
  render(): Promise<void>;

  /**
   * Manually trigger an event on the client. Useful for testing/debugging.
   *
   * @param eventName - The name of an event registered on the Client.
   * @param data - Optional data to pass into the callback
   *
   * @throws Throws an error if the event name is not registered.
   *
   * @returns The return of the registered event, if any.
   */
  trigger(eventName: string, data: any): Promise<any>;
}
