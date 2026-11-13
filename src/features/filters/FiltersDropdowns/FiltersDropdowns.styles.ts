import { css, styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';
import { StyledFilterCheckbox } from '../FilterCheckbox.styles';

export const StyledDropdownContainer = styled.div<{
  $smallSelectors?: boolean;
  disabled?: boolean;
  $showSeparator?: boolean;
}>`
  display: inline;

  /* ent-select-search */
  background-color: transparent;
  font-size: 0.9rem;
  border: none;
  padding: 0 12px 0;
  border-left: 1px solid white;
  height: 44px;
  display: flex;

  /* smallSelectors */
  ${(props) =>
    props.$smallSelectors &&
    `
      padding: 0;
    `}

  /* disabled */
  ${(props) =>
    props.disabled &&
    `
      opacity: 0.6;
      `}

      ${(props) =>
        props.$showSeparator &&
        `
      border-left: 1px solid #e0e0e0;
      `}
`;

/** Hides the filters below the desktop breakpoint when asked to. */
export const StyledFiltersRoot = styled.div<{ $hideOnMobile?: boolean }>`
  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    css`
      @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
        display: none !important;
      }
    `}
`;

/** Box of one filter: the panel is positioned against it. */
export const StyledFilterDropdownBox = styled.div<{ $fullWidth: boolean }>`
  display: inline-block;
  position: relative;
  max-width: 100%;
  vertical-align: middle;
  backface-visibility: hidden;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      min-width: 1px;
      margin-bottom: 10px !important;
    `}
`;

/** Panel of options, opened under the toggle and aligned on its right edge. */
export const StyledFilterDropdownPanel = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1020;
  margin-top: 10px;
  box-sizing: border-box;
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  padding: 25px;
  background: ${COLORS.white};
  color: ${COLORS.black};
  box-shadow: ${SHADOWS.dropdown};
`;

/** Title of the filter inside its toggle. */
export const StyledFilterToggleTitle = styled.span`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  min-width: 1px;
  max-width: 100%;
  margin-right: 10px !important;
  text-align: left !important;
`;

/** One option: its checkbox and its label. */
export const StyledFilterOption = styled.label<{ $spaced: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.5;
  ${({ $spaced }) =>
    $spaced &&
    css`
      margin-bottom: 10px !important;
    `}
`;

export const StyledFilterOptionCheckbox = styled(StyledFilterCheckbox)`
  margin-top: 1px;
  margin-right: 10px !important;
`;

export const StyledFilterOptionLabel = styled.div`
  flex: 1;
`;
