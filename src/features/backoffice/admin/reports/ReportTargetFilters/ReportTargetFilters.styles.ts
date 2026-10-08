import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledReportFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin: 24px 0;
  padding: 16px 20px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: 12px;
  }
`;

export const StyledReportTypePills = styled.div`
  display: flex;
  flex: 1 1 420px;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    flex-basis: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

export const StyledReportTypePill = styled.button<{ $isChecked: boolean }>`
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

export const StyledReportSelects = styled.div`
  display: flex;
  gap: 16px;

  > * {
    min-width: 160px;
  }

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    flex-basis: 100%;
    gap: 8px;

    > * {
      min-width: 0;
    }
  }
`;
