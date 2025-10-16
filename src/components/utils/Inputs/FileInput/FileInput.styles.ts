import styled from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledFileInputGroupForm = styled.div`
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

export const StyledFileInputWrapper = styled.div`
  position: relative;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const StyledHiddenInput = styled.input`
  display: none;
`;
