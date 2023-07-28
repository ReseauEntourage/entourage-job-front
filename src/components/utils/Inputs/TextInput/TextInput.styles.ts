import styled from 'styled-components';
import { commonInputStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledTextInputContainer = styled.div`
  min-width: 300px;
  max-width: 100%;
  input {
    ${() => commonInputStyles}
    margin-bottom: 30px;
    &.secondary {
      padding: 16px 36px;
      border: #d9d9d9 1px solid;
      border-radius: 30px;
      width: 100%;
      font-size: 12px;
      line-height: normal;
    }
    &::placeholder {
      font-style: italic;
      color: ${COLORS.darkGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
