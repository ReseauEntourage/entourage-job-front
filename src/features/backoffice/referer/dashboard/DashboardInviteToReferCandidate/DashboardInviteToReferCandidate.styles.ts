import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

export const StyledDescriptionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 10%;
  }
`;
