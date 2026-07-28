import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import {
  commonInputContainerStyles,
  commonInputStyles,
} from '../Inputs.styles';

export const StyledPhoneInput = styled.div<{ disabled?: boolean }>`
  ${() => commonInputContainerStyles}

  .PhoneInput {
    ${() => commonInputStyles}
    padding: 0 !important;
  }
  .PhoneInputCountry {
    margin-right: 0px;
    margin-left: 16px;
  }
  input {
    ${() => commonInputStyles}
    margin-bottom: 0 !important;
    min-height: 0;
    border: none;
    &::placeholder {
      font-style: italic;
      color: ${COLORS.mediumGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
