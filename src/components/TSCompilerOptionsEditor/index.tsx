import { useEffect, useState } from 'react';
import MonacoEditor, { EditorWillMount, monaco } from 'react-monaco-editor';
import { useCompilerOptionSchema } from '../../utils/hooks/useCompilerOptionSchema';
import { IOptions, useOptions } from '../../utils/hooks/useOptions';

let monacoEditor: typeof monaco | undefined;

const serialize = JSON.parse;
const deserialize = (json: any) => JSON.stringify(json, null, 2);

const getOptions = (options: IOptions['compilerOptions']) => {
  return {
    ...options,
    target: monaco.languages.typescript.ScriptTarget[options.target as any],
    jsx: monaco.languages.typescript.JsxEmit[options.jsx as any],
  };
};

export const TSCompilerOptionsEditor = () => {
  const { options, onChangeOption } = useOptions();
  const { schemaProperties } = useCompilerOptionSchema();

  const [text, setText] = useState('');

  /**
   * wait until option restored
   */
  useEffect(() => {
    const text = deserialize(getOptions(options.compilerOptions));
    setText(text);
  }, [options.compilerOptions]);

  const onChangeText = (newText: string) => {
    setText(newText);

    try {
      const json = serialize(newText);
      onChangeOption('compilerOptions', json);
    } catch (err) {
      console.error(err);
    }
  };

  const editorWillMount: EditorWillMount = (monaco) => {
    monacoEditor = monaco;
  };

  useEffect(() => {
    monacoEditor?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'http://json.schemastore.org/tsconfig.json',
          fileMatch: ['*'],
          schema: {
            type: 'object',
            properties: schemaProperties,
          },
        },
      ],
    });
  }, [schemaProperties, monacoEditor]);

  return (
    <MonacoEditor
      value={text}
      onChange={onChangeText}
      editorWillMount={editorWillMount}
      language="json"
      width="400"
      height="300"
    />
  );
};
