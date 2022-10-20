import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
  vertical-align: middle !important;
  position: relative;
  th {
    position: sticky;
    top: 0;
    padding: 16px 15px;
    text-align: left;
    vertical-align: bottom;
    font-size: 0.875rem;
    font-weight: 400;
    color: #999;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    th {
      display: none;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  button {
    margin-left: 20px;
  }
`;
