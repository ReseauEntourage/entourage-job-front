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

// « Titre » and, on the right, the mention of a proposed title (below it
// on mobile)
export const StyledTitleLabelRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

export const StyledTitleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 24px;

  &:empty {
    display: none;
  }
`;

export const StyledComposerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.extraLightGray};
`;

export const StyledComposerVisibility = styled.div`
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.darkGray};
`;
