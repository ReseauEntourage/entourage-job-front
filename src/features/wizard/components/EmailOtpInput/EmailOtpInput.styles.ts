import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledDigitsRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledDigitBox = styled.input<{ hasError: boolean }>`
  width: 48px;
  height: 56px;
  border: 2px solid
    ${({ hasError }) => (hasError ? COLORS.lightRed : COLORS.primaryBlue)};
  border-radius: 8px;
  text-align: center;
  font-family: Poppins, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: ${COLORS.darkGray};
  outline: none;
  background: ${COLORS.white};

  &:focus {
    border-color: ${({ hasError }) =>
      hasError ? COLORS.lightRed : COLORS.primaryBlue};
    box-shadow: 0 0 0 3px
      ${({ hasError }) =>
        hasError ? `${COLORS.lightRed}33` : `${COLORS.primaryBlue}33`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledResendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Poppins, sans-serif;
  font-size: 14px;
  color: ${COLORS.darkGray};
`;
