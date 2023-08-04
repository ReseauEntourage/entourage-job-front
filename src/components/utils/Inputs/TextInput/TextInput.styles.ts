import styled from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledTextInputContainer = styled.div`
  ${() => commonInputContainerStyles}
  input {
    ${() => commonInputStyles}
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

export const StyledAnnotations = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledLengthLimit = styled.div`
  color: ${({ warning }) => {
    return warning ? COLORS.noRed : COLORS.darkGray;
  }};
  font-size: 12px;
  text-align: right;
  align-self: flex-end;
  transform: translate(0, -30px);
`;
