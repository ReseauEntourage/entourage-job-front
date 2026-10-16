import { css, styled } from 'styled-components';
import { SimpleLink } from '@/src/components/ui/SimpleLink';
import { COLORS } from '@/src/constants/styles';

const entryStyles = css<{ $selected?: boolean; $isChild?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
  width: ${({ $isChild }) => ($isChild ? 'calc(100% - 16px)' : '100%')};
  min-height: ${({ $isChild }) => ($isChild ? 40 : 44)}px;
  margin-left: ${({ $isChild }) => ($isChild ? 16 : 0)}px;
  padding: 0 16px;
  border: 0;
  border-radius: 20px;
  background-color: ${({ $selected }) =>
    $selected ? COLORS.primaryBlue : 'transparent'};
  color: ${({ $selected }) => ($selected ? COLORS.white : COLORS.black)};
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover {
    color: ${({ $selected }) => ($selected ? COLORS.white : COLORS.black)};
    background-color: ${({ $selected }) =>
      $selected ? COLORS.primaryBlue : COLORS.hoverBlue};
  }
`;

export const StyledMobileEntryLink = styled(SimpleLink)<{
  $selected?: boolean;
  $isChild?: boolean;
}>`
  ${entryStyles}
`;

export const StyledMobileEntryButton = styled.button<{
  $selected?: boolean;
  $isChild?: boolean;
  $color?: string;
}>`
  ${entryStyles}
  ${({ $color }) => ($color ? `color: ${$color};` : '')}
`;

export const StyledMobileEntryContent = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/** Count of a menu entry, e.g. the reports to handle on « Administration » */
export const StyledMobileEntryBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 11px;
  background-color: ${COLORS.lightRed};
  color: ${COLORS.white};
  font-size: 11px;
  font-weight: 600;
`;
