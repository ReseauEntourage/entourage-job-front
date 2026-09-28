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
 * The rest of the modal — overlay, width, header, scrolling body, footer,
 * mobile sheet — comes from `ModalGeneric`: only the content specific to the
 * charter summary is left here.
 */
export const StyledMessagingEthicsCharterSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 20px 0;
`;

export const StyledMessagingEthicsCharterSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const StyledMessagingEthicsCharterSectionIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 3px;
`;

export const StyledMessagingEthicsCharterSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

/**
 * The product bullets, tightened: a summary of five sections read at a glance
 * needs a denser rhythm than the full charter page they were sized for.
 */
export const StyledMessagingEthicsCharterPoints = styled.div`
  li {
    padding-left: 18px;

    &:not(:last-child) {
      margin-bottom: 2px;
    }

    &:before {
      width: 6px;
      height: 6px;
      top: 9px;
    }
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
