import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledIntroductionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledIntroductionParagraphe = styled.div`
  white-space: pre-line;
  color: ${COLORS.black};
  font-style: italic;
  font-size: 16px;
  line-height: 24px;
`;
