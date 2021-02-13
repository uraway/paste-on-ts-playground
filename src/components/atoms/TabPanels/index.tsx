import { Children, cloneElement, FC, isValidElement } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
    width: 100%;
`;

export const TabPanels: FC = ({ children }) => {
    return (
        <StyledContainer>
            {Children.map(children, (child, index) => {
                if (!isValidElement(child)) {
                    return child;
                }
                return cloneElement(child, { index });
            })}
        </StyledContainer>
    );
};
