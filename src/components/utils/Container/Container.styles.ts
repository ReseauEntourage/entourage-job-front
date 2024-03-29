import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: block;
  margin: 0 20px;
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    margin: 0 auto;
    max-width: 1440px;
  }
`;
