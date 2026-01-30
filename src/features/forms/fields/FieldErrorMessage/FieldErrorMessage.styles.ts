import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledErrorMessage = styled.div`
  color: ${COLORS.darkOrange};
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: flex-start;
  > * {
    padding-top: 5px;
  }
`;
