import { useEffect, useState } from "react";
import MonacoEditor, {
    EditorDidMount,
    EditorWillMount,
    monaco,
} from "react-monaco-editor";
import { Outputs } from "../../popup";
import { IOptions } from "../../utils/hooks/useOptions";

export interface EditorProps {
    options: IOptions;
    onCompileTS: (outputs: Outputs) => void;
}

const editorOptions: monaco.editor.IEditorOptions = {
    minimap: {
        enabled: false,
    },
};

const defaultInputValue = `console.log("aaa")`;

let monacoEditor: typeof monaco | undefined;
let instance: monaco.editor.IStandaloneCodeEditor | undefined;

export const TSEditor = ({ onCompileTS, options }: EditorProps) => {
    const [inputValue, setInputValue] = useState(defaultInputValue);

    /** Compiler options apply */
    useEffect(() => {
        monacoEditor?.languages.typescript.typescriptDefaults.setCompilerOptions(
            options.compilerOptions
        );
    }, [options.compilerOptions]);

    /** Compile when inputValue is set or compilerOptions are updated */
    useEffect(() => {
        const compile = async () => {
            const model = instance?.getModel();
            if (model) {
                const js = await getRunnableJS(model);
                const dts = await getDTSForCode(model);

                onCompileTS({
                    js,
                    dts,
                });
            }
        };
        compile();
    }, [instance, inputValue, options.compilerOptions]);

    const editorWillMount: EditorWillMount = (monaco) => {
        monacoEditor = monaco;
    };

    const editorDidMount: EditorDidMount = (editor) => {
        instance = editor;

        const model = monacoEditor?.editor.createModel(
            "",
            "typescript",
            monaco.Uri.from({
                scheme: "file",
                path: "/main.ts",
            })
        );
        editor.setModel(model!);
    };

    const getWorker = monacoEditor?.languages.typescript.getTypeScriptWorker;

    const getRunnableJS = async (model: monaco.editor.ITextModel) => {
        const result = await getEmitResult(model);
        const firstJS = result?.outputFiles.find(
            (o: any) => o.name.endsWith(".js") || o.name.endsWith(".jsx")
        );
        return (firstJS && firstJS.text) || "";
    };

    const getDTSForCode = async (model: monaco.editor.ITextModel) => {
        const result = await getEmitResult(model);
        return (
            result?.outputFiles.find((o: any) => o.name.endsWith(".d.ts"))
                ?.text ?? ""
        );
    };

    const getEmitResult = async (model: monaco.editor.ITextModel) => {
        const client = await getWorkerProcess(model);
        return await client?.getEmitOutput(model.uri.toString());
    };

    const getWorkerProcess = async (model: monaco.editor.ITextModel) => {
        const worker = await getWorker?.();
        return await worker?.(model.uri);
    };

    return (
        <MonacoEditor
            height={options.height}
            width={options.width}
            value={inputValue}
            onChange={setInputValue}
            language="typescript"
            editorWillMount={editorWillMount}
            editorDidMount={editorDidMount}
            options={editorOptions}
        />
    );
};
