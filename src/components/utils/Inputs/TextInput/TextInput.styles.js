import styled from 'styled-components';
// import { commonInputDesignFeatures } from "../Inputs.styles";
import { COLORS } from '../../../../constants/styles';

export const StyledTextInputContainer = styled.div`
  width: 400px;
  max-width: 100%;
  input {
    width: 100%;
    background-color: white;
    border: 0.5px solid white;
    border-bottom: solid 2px ${COLORS.gray};
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    padding: 4px 0;
    &::placeholder {
      font-style: italic;
      color: ${COLORS.darkGray};
    }
    &:focus-visible {
      outline: none;
    }
  }
`;
