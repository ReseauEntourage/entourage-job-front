import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRadioContainer = styled.div`
  font-family: Poppins, sans-serif;
  legend {
    color: ${COLORS.darkGray};
    margin-bottom: 24px;
  }
  .inputs-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    label {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      line-height: 16px;
      padding: 6px 6px 6px 0;
      border-radius: 13px;
      &:hover {
        cursor: pointer;
      }
      input[type='radio'] {
        margin: 0 8px 0 6px;
        height: 14px;
        width: 14px;
        appearance: none;
        -webkit-appearance: none;
        border: 0.5px solid ${COLORS.primaryOrange};
        border-radius: 50%;
        accent-color: white;
        cursor: pointer;
      }
      &.checked {
        background-color: ${COLORS.primaryOrange};
        color: white;
        input[type='radio'] {
          background-color: ${COLORS.primaryOrange};
          position: relative;
          border-color: white;
          &::after {
            content: '';
            position: absolute;
            top: 1px;
            left: 1px;
            height: 10px;
            width: 10px;
            background-color: white;
            border-radius: 50%;
          }
        }
      }
    }
  }
`;
