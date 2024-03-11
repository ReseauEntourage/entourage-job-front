import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledPasswordCriteriasList = styled.ul<{ removeMargin: boolean }>`
  margin: 0;
  margin-bottom: ${({ removeMargin }) => (removeMargin ? 0 : '30px')};
  border-radius: 20px;
  padding: 20px 10px 20px 35px;
  background-color: ${COLORS.hoverBlue};
  font-size: 12px;
  line-height: 18px;
`;
