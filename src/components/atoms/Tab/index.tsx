import { ComponentPropsWithoutRef, FC } from "react";
import styled from "styled-components";
import { tsColor } from "../../../popup/styles/colors";
import { useTabsContext } from "../Tabs";

const StyledButton = styled.div<{ isActive: boolean }>`
    padding: 0.5rem 1rem;
    ${({ isActive }) => isActive && `border-bottom: 1px solid ${tsColor};`}
`;

export interface TabProps extends ComponentPropsWithoutRef<"div"> {
    index?: number;
}

export const Tab: FC<TabProps> = ({ children, index, ...others }) => {
    const { currentIndex, onChange } = useTabsContext();
    const isActive = currentIndex === index;

    const onClick = () => {
        onChange(index!);
    };

    return (
        <StyledButton isActive={isActive} onClick={onClick}>
            <div {...others}>{children}</div>
        </StyledButton>
    );
};
