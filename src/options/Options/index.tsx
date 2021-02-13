import styled from "styled-components";
import { TSCompilerOptionsEditor } from "../../components/TSCompilerOptionsEditor";
import { useOptions } from "../../utils/hooks/useOptions";
import { useTSVersions } from "../../utils/hooks/useTSVersions";

const StyledContainer = styled.div<{ width: number; height: number }>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    padding: 0;
    margin: 0;
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;
`;

const Label = styled.label`
    display: flex;
    flex-direction: row;
    padding-bottom: 0.2rem;
    > * {
        &:nth-child(2) {
            margin-left: auto;
        }
    }
`;

export const Options = () => {
    const { tsVersions } = useTSVersions();
    const { options, onChangeOption, reset } = useOptions({ tsVersions });
    return (
        <StyledContainer width={options.width} height={options.height}>
            <FormWrapper>
                <Label>
                    <span>Editor height (px): </span>
                    <input
                        type="number"
                        value={options.height}
                        onChange={(event) =>
                            onChangeOption("height", event.target.value)
                        }
                    />
                </Label>

                <Label>
                    <span>Editor width (px): </span>
                    <input
                        type="number"
                        value={options.width}
                        onChange={(event) =>
                            onChangeOption("width", event.target.value)
                        }
                    />
                </Label>

                <Label>
                    <span>TS version: </span>
                    <select
                        value={options.tsVersion ?? ""}
                        onChange={(event) =>
                            onChangeOption("tsVersion", event.target.value)
                        }
                    >
                        {tsVersions.map((tsVersion) => (
                            <option key={tsVersion} value={tsVersion}>
                                {tsVersion}
                            </option>
                        ))}
                    </select>
                </Label>

                <Label>
                    <span>TS Compiler options: </span>
                </Label>

                <TSCompilerOptionsEditor />
            </FormWrapper>
            <button onClick={reset}>RESET Options</button>
        </StyledContainer>
    );
};
