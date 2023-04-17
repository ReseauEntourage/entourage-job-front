import styled from 'styled-components';
// import { commonInputDesignFeatures } from "../Inputs.styles";
import { COLORS } from 'src/constants/styles';

export const StyledPhoneInput = styled.div`
  min-width: 300px;
  max-width: 100%;
  margin-bottom: 30px;
  .label-top {
    font-size: 14px;
    padding: 4px 0;
    display: inline-block;
    line-height: 17px;
    font-family: Poppins, sans-serif;
  }
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
    border: none;
    min-width: unset;
    width: 100%;
    background-color: white;
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    padding: 4px 0;
    font-family: Poppins, sans-serif !important;
    &::placeholder {
      font-style: italic;
      color: ${COLORS.darkGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
