import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';
import { RadioVariant } from './Radio.types';

export const StyledRadioContainer = styled.div<{
  disabled?: boolean;
  $variant?: RadioVariant;
}>`
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  font-family: Poppins, sans-serif;

  legend {
    color: ${COLORS.mediumGray};
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
        flex-shrink: 0;
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

  ${({ $variant }) =>
    $variant === 'cards'
      ? `
  .inputs-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 8px;

    @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
      grid-template-columns: minmax(0, 1fr);
    }

    > div {
      display: flex;
    }

    label {
      flex: 1;
      box-sizing: border-box;
      gap: 10px;
      min-height: 48px;
      margin: 0;
      padding: 0 14px;
      line-height: 1.4;
      border: 1px solid ${COLORS.gray};
      border-radius: 8px;
      background-color: ${COLORS.white};
      color: ${COLORS.black};

      input[type='radio'] {
        margin: 0;
        height: 18px;
        width: 18px;
        border: 1px solid ${COLORS.darkTeal};
      }

      &:hover {
        border-color: ${COLORS.darkTeal};
      }

      &.checked {
        /* The thicker border keeps the label in place: one pixel less padding */
        padding: 0 13px;
        border: 2px solid ${COLORS.darkTeal};
        background-color: ${COLORS.hoverBlue};
        color: ${COLORS.black};

        input[type='radio'] {
          background-color: ${COLORS.white};
          border-color: ${COLORS.darkTeal};

          &::after {
            background-color: ${COLORS.darkTeal};
          }
        }
      }
    }
  }
`
      : ''}
`;

export const StyledRadioDisabledOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* position: absolute; */
  background-color: ${COLORS.hoverBlue};
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  top: -10px;
  left: 0;
  bottom: -10px;
  right: 0;
  white-space: pre-line;
  > svg {
    margin-bottom: 16px;
  }
`;

export const StyledRadioSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
