import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledParametresDescriptionParagraphe = styled.div`
  white-space: pre-line;
`;

export const StyledParametresDescriptionEditText = styled.a`
  color: #979797;
  text-decoration: underline;
  font-style: italic;
  margin-top: 20px;
  display: block;
  &:hover {
    text-decoration: underline;
    color: ${COLORS.darkGrayFont};
  }
`;
