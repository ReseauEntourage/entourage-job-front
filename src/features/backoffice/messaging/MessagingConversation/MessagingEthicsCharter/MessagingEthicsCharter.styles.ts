import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

/**
 * Discreet line above the editor: it outlives the modal being closed and
 * remains the only permanent reminder of the charter in the conversation.
 */
export const StyledMessagingEthicsCharterNote = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 0 20px 6px 20px;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 16px 6px 16px;
  }
`;

export const StyledMessagingEthicsCharterNoteLink = styled.a`
  color: ${COLORS.darkGray};
  text-decoration: underline;

  &:hover {
    color: ${COLORS.darkBlue};
  }
`;

/**
 * Native link rather than `Button href newTab`: the component's `newTab` prop
 * only has an effect on an external link, where it sets `target="_"` instead
 * of `_blank`.
 */
export const StyledMessagingEthicsCharterLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.extraDarkGray};
  text-decoration: underline;

  &:hover {
    color: ${COLORS.darkBlue};
  }
`;
