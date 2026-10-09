import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledFilterPills = styled.div<{ $scrollOnMobile: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  ${({ $scrollOnMobile }) =>
    $scrollOnMobile &&
    `
    @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
      flex-wrap: nowrap;
      overflow-x: auto;
    }
  `}
`;

export const StyledFilterPill = styled.button<{ $isChecked: boolean }>`
  flex: none;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid
    ${({ $isChecked }) => ($isChecked ? COLORS.darkBlue : COLORS.gray)};
  border-radius: 20px;
  background-color: ${({ $isChecked }) =>
    $isChecked ? COLORS.hoverBlue : COLORS.white};
  color: ${({ $isChecked }) => ($isChecked ? COLORS.darkBlue : COLORS.black)};
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${COLORS.darkBlue};
  }
`;
