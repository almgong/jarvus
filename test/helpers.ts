/**
 * Waits for previously initiated asynchronous operations to finish
 *
 * @returns Promise<void>
 */
export function waitForAsync() {
  return new Promise<void>((res) => {
    setTimeout(res, 0); // taking advantage of JS async queue's impl
  });
}