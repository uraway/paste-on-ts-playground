import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Options } from './Options';

const StyledContainer = styled.div`
  padding: 0.5rem;
`;

export const OptionsPage = () => {
  return (
    <StyledContainer>
      <Options />
    </StyledContainer>
  );
};

document.addEventListener('DOMContentLoaded', (event) => {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  ReactDOM.render(<OptionsPage />, app);
});
