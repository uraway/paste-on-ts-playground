import { useEffect, useState } from 'react';
import { fetch } from '../fetch';

const cacheKey = 'tsVersionsCache';
const url = 'https://api.github.com/repos/microsoft/TypeScript/tags?page=1';

type Response = { name: string }[];

export const useTSVersions = () => {
  const [tsVersions, setTSVersions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await fetch<Response>({ cacheKey, url });
      const result = data.flatMap((t) =>
        /beta|rc/.test(t.name) ? [] : t.name
      );
      setTSVersions(result);
    })();
  }, []);

  return { tsVersions };
};
