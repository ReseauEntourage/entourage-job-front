import styled from 'styled-components';
// import { commonInputDesignFeatures } from "../Inputs.styles";
import { commonInputStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledPhoneInput = styled.div`
  min-width: 300px;
  max-width: 100%;
  margin-bottom: 30px;
  .PhoneInput {
    background-color: white;
    border: 0.5px solid white;
    border-bottom: solid 2px ${COLORS.gray};
    padding-top: 0;
    min-height: 30px;
  }
  .PhoneInputCountry {
    margin-right: 10px;
    margin-left: 5px;
  }
  input {
    ${() => commonInputStyles}
    border: none;
    &::placeholder {
      font-style: italic;
      color: ${COLORS.darkGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
