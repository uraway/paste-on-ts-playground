import { browser } from 'webextension-polyfill-ts';

/**
 * Only available in options/popup
 * TODO: cache timeout
 */
export async function fetch<T = any>({
  cacheKey,
  url,
}: {
  cacheKey: string;
  url: string;
}): Promise<T> {
  const cache = await browser.storage.local.get(cacheKey);
  if (cache.cacheKey) {
    console.log('cache found', cache[cacheKey]);
    return cache[cacheKey];
  }

  return new Promise<T>((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: 'get',
        url,
      },
      (data: T) => {
        browser.storage.local.set({ [cacheKey]: data });
        resolve(data);
      }
    );
  });
}
