import { useEffect, useState } from 'react';
import { fetch } from '../fetch';

const url =
  'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json';

export const useCompilerOptionSchema = () => {
  const [schemaProperties, setShemaProperties] = useState({});

  useEffect(() => {
    (async () => {
      const data = await fetch({ cacheKey: 'schema', url });
      setShemaProperties(
        data['definitions']['compilerOptionsDefinition']['properties'][
          'compilerOptions'
        ]['properties']
      );
    })();
  }, []);

  return { schemaProperties };
};
