import { css, styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';
import { StyledFilterCheckbox } from './FilterCheckbox.styles';

/** Row of the checkbox filters, hidden below the desktop breakpoint when asked to. */
export const StyledFiltersCheckboxesRoot = styled.div<{
  $hideOnMobile?: boolean;
}>`
  display: flex;
  align-items: center;
  margin-bottom: 10px !important;

  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    css`
      @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
        display: none !important;
      }
    `}
`;

export const StyledFiltersCheckboxCell = styled.div<{ $fullWidth?: boolean }>`
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      flex: 1;
    `}
`;

export const StyledFiltersCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  height: 20px;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const StyledFiltersCheckboxTitle = styled.div`
  flex: 1;
`;

export const StyledFiltersCheckbox = styled(StyledFilterCheckbox)`
  margin-top: 2px;
  margin-left: 10px !important;
`;
