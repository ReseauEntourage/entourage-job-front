import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRadioContainer = styled.div`
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  font-family: Poppins, sans-serif;

  legend {
    color: ${COLORS.darkGray};
    margin-bottom: 24px;
    margin-top: 20px;
  }

  .inputs-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-top: 10px;
      margin-bottom: 10px;
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
        border: 0.5px solid ${COLORS.primaryBlue};
        border-radius: 50%;
        accent-color: white;
        cursor: pointer;
        align: middle;
      }

      &.checked {
        background-color: ${COLORS.primaryBlue};
        color: white;

        input[type='radio'] {
          background-color: ${COLORS.primaryBlue};
          position: relative;
          border-color: white;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
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

export const StyledRadioSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
