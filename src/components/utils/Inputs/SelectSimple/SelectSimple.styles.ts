import styled from 'styled-components';
import {
  commonInputContainerStyles,
  commonInputStyles,
  commonMenuOptionStyles,
} from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledSelectContainer = styled.div`
  ${() => commonInputContainerStyles}
  .select {
    width: 100%;
    border: none;
    position: relative;
    margin-bottom: 30px;
    .placeholder,
    .selected-value {
      ${() => commonInputStyles}
      margin-bottom: 0;
      &:hover {
        cursor: pointer;
      }
      span {
        float: right;
        height: 18px;
        width: 18px;
        color: ${COLORS.primaryOrange};
      }
    }
    .placeholder {
      color: ${COLORS.darkGray};
      font-style: italic;
      font-family: Poppins, sans-serif !important;
      label {
        &:hover {
          cursor: pointer;
        }
      }
    }

    ul.options-container {
      min-width: 300px;
      width: 100%;
      z-index: 100;
      max-width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid #f4f3f3;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: absolute;
      max-height: 175px;
      overflow-y: scroll;
      left: 0;
      li.option {
        list-style: none;
        margin: 0;
        padding: 0;
        button {
          ${() => commonMenuOptionStyles}

          &:hover {
            border: 0.5px solid ${COLORS.primaryOrange};
            color: ${COLORS.primaryOrange};
            cursor: pointer;
          }
        }
      }
    }
  }
`;
