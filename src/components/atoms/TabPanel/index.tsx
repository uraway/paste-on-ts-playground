import { FC } from 'react';
import styled from 'styled-components';
import { useTabsContext } from '../Tabs';

export interface TabPanelProps {
  index?: number;
}

const StyledContainer = styled.div<{ isActive: boolean }>`
  padding-top: 1rem;
  ${({ isActive }) => !isActive && `display: none;`}
`;

export const TabPanel: FC<TabPanelProps> = ({ children, index }) => {
  const { currentIndex } = useTabsContext();
  const isActive = currentIndex === index;

  return <StyledContainer isActive={isActive}>{children}</StyledContainer>;
};
