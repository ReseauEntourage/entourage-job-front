import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledPrimaryTextInput = styled.input`
  padding: 16px 36px;
  border: ${COLORS.gray} 1px solid;
  border-radius: 30px;
  width: 100%;
  &::placeholder {
    color: ${COLORS.darkgray};
    font-style: italic;
  }
`;
