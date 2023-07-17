import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledOppCTAsContainer = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding-left: 0;
  margin-bottom: 0;
  li {
    list-style: none;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    li:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;
