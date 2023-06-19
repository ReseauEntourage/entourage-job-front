import styled from 'styled-components';
// import { commonInputDesignFeatures } from "../Inputs.styles";
import { COLORS } from 'src/constants/styles';

export const StyledTextInputContainer = styled.div`
  min-width: 300px;
  max-width: 100%;
  label {
    padding: 4px 0;
    font-size: 14px;
    line-height: 17px;
    height: 25px;
    box-sizing: border-box;
    font-family: Poppins, sans-serif;
    display: inline-block;
  }
  input {
    font-family: Poppins, Arial, sans-serif;
    min-width: unset;
    width: 100%;
    background-color: white;
    border: 0.5px solid white;
    color: ${COLORS.black};
    border-bottom: solid 2px ${COLORS.gray};
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    padding: 4px 0;
    margin-bottom: 30px;
    min-height: 30px;
    box-sizing: border-box;
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
