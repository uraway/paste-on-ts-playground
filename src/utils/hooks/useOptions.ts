import { useEffect, useState } from 'react';
import { monaco } from 'react-monaco-editor';
import { browser } from 'webextension-polyfill-ts';

const cacheKey = 'ts-browser-options';

export interface IOptions {
  tsVersion: string;
  compilerOptions: monaco.languages.typescript.CompilerOptions;
  height: number;
  width: number;
  tsCode: string;
}

const defaultOptions: IOptions = {
  tsVersion: '',
  compilerOptions: {
    allowJs: false,
    checkJs: false,
    declaration: true,
    emitDecoratorMetadata: false,
    esModuleInterop: false,
    experimentalDecorators: false,
    noImplicitAny: false,
    noImplicitReturns: false,
    noImplicitThis: false,
    strict: false,
    strictBindCallApply: false,
    strictFunctionTypes: false,
    strictNullChecks: false,
    strictPropertyInitialization: false,
    // enum
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2015,
  },
  height: 500,
  width: 400,
  tsCode: '',
};

async function getOptionsFromStorage() {
  const result = await browser.storage.local.get(cacheKey);
  return result[cacheKey];
}

export const useOptions = ({ tsVersions }: { tsVersions?: string[] } = {}) => {
  const [options, setOptions] = useState<IOptions>(defaultOptions);

  const reset = () => {
    setOptions({ ...defaultOptions });
    console.log('Options reset', defaultOptions);
    browser.storage.local.set({ [cacheKey]: defaultOptions });
  };

  /**
   * Update from storage
   */
  useEffect(() => {
    (async () => {
      const cachedOptions = await getOptionsFromStorage();
      console.log('cachedOptions', cachedOptions);
      setOptions(cachedOptions ?? defaultOptions);
    })();
  }, []);

  /**
   * Update tsVersion
   */
  useEffect(() => {
    if (!options.tsVersion && tsVersions && tsVersions?.length > 0) {
      setOptions({ ...options, tsVersion: tsVersions?.[0] });
    }
  }, [tsVersions?.length]);

  const onChangeOption = (key: keyof IOptions, value: any) => {
    const newOptions = {
      ...options,
      [key]: value,
    };
    setOptions(newOptions);
    console.log('New options set', newOptions);
    browser.storage.local.set({ [cacheKey]: newOptions });
  };

  return { options, onChangeOption, reset };
};
