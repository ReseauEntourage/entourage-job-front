import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// Closed composer: one line, the viewer's avatar then the invitation
export const StyledComposerBar = styled.section`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
    padding: 10px 12px;
  }
`;

export const StyledComposerBarButton = styled.button`
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 22px;
  background-color: ${COLORS.lightGray};
  color: ${COLORS.darkGray};
  font-family: inherit;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: text;

  &:hover,
  &:focus-visible {
    border-color: ${COLORS.primaryBlue};
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 16px;
    font-size: 13px;
  }
`;

export const StyledComposer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 14px;
    padding: 16px;
  }
`;

export const StyledComposerHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledTitleField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// « Titre » and, on its right, the button asking for a proposal. A single
// line, mobile included: the button only goes below the label when it does
// not fit.
export const StyledTitleLabelRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 8px;
`;

// Live region under the field: the wait, the failure and the mention of a
// proposed title, read out by screen readers. Always rendered, hidden while
// empty.
export const StyledTitleStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:empty {
    display: none;
  }
`;

// Discreet mention that the title was proposed by the AI
export const StyledTitleMention = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${COLORS.darkGray};
`;

export const StyledComposerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.extraLightGray};

  /* Mobile: the visibility mention on its own line, then « Annuler » and
     « Publier » side by side across the full width */
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    > button {
      flex: 1 1 0;
      justify-content: center;
    }

    > button:last-child {
      flex-grow: 2;
    }
  }
`;

export const StyledComposerVisibility = styled.div`
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.darkGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-basis: 100%;
  }
`;
