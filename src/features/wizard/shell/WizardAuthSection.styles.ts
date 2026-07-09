import styled from 'styled-components';
import { SimpleLink } from 'src/components/ui';
import { COLORS } from 'src/constants/styles';

export const StyledLoginLink = styled(SimpleLink)<{ $onDark?: boolean }>`
  font-size: 0.9rem;
  white-space: nowrap;
  color: ${({ $onDark }) => ($onDark ? COLORS.white : COLORS.black)};
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 1;
  }
`;

export const StyledUserToggle = styled.a<{ $onDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  color: ${({ $onDark }) => ($onDark ? COLORS.white : COLORS.black)} !important;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

/*
 * The parent StyledWizardSidePanel uses `&& * { color: white }` (2x class specificity).
 * This wrapper uses `&&&&` (4x) to override it for the dropdown menu items,
 * which have a white background and need dark text.
 */
export const StyledDropdownItemsReset = styled.div`
  &&&& *[class] {
    color: ${COLORS.black};
  }
  &&&& svg {
    color: ${COLORS.black};
    fill: none;
  }
  &&&& *[class]:hover {
    color: ${COLORS.primaryBlue};
    background-color: ${COLORS.hoverBlue};
  }
`;
