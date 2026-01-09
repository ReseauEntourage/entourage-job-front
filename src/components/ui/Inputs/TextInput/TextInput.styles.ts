import styled from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledTextInputGroupForm = styled.div`
  ${() => commonInputContainerStyles}
  input {
    ${() => commonInputStyles}
    &.secondary {
      padding: 16px 36px;
      border: #d9d9d9 1px solid;
      border-radius: 30px;
      width: 100%;
      line-height: normal;
    }
    &::placeholder {
      font-style: italic;
      color: ${COLORS.mediumGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;

export const StyledTextInputWrapper = styled.div`
  position: relative;
`;

export const StyledEyeIconWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 4px;
`;
