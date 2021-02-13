import { Children, cloneElement, FC, isValidElement } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
`;

export const TabList: FC = ({ children }) => {
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
