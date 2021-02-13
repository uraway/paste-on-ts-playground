import { useEffect, useState } from "react";
import { monaco } from "react-monaco-editor";
import styled from "styled-components";
import { IOptions } from "../../utils/hooks/useOptions";

export interface EmittedJsProps {
    value: string;
    options: IOptions;
}

const StyledContainer = styled.div<{ width: number; height: number }>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    padding: 0;
    margin: 0;
`;

const StyledDiv = styled.div`
    padding: 0 2rem;
`;

export const Preview = ({ value, options }: EmittedJsProps) => {
    const [coloredText, setColoredText] = useState("");

    useEffect(() => {
        async function color() {
            const coloredText = await monaco.editor.colorize(
                value,
                "typescript",
                {}
            );
            setColoredText(coloredText);
        }
        color();
    }, [value]);

    return (
        <StyledContainer height={options.height} width={options.width}>
            <StyledDiv dangerouslySetInnerHTML={{ __html: coloredText }} />
        </StyledContainer>
    );
};
