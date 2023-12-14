import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTag = styled.div`
  display: inline-block;
  margin-right: 20px;
  padding: 3px 10px;
  border-radius: 5px;
  background-color: #f55f241a;
  border: #f55f241a 1px solid;
  color: ${COLORS.primaryOrange};
  font-size: 14px;
  font-weight: 400;
`;
