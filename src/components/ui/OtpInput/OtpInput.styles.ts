import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledOtpContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const StyledOtpField = styled.input<{ hasError: boolean }>`
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid
    ${({ hasError }) => (hasError ? COLORS.orangeSocial : COLORS.gray)};
  border-radius: 8px;
  outline: none;
  caret-color: transparent;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ hasError }) =>
      hasError ? COLORS.orangeSocial : COLORS.primaryBlue};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;
