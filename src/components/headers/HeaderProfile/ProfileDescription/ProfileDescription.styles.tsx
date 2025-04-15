import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledDescriptionParagraphe = styled.div`
  white-space: pre-line;
  color: ${COLORS.black};
  font-style: italic;
  font-size: 16px;
  line-height: 24px;
`;
