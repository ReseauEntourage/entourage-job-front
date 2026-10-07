import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// Full-width band of the header, above the two columns
export const StyledHelpGroupHeaderBand = styled.header`
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.extraLightGray};
`;

export const StyledHelpGroupHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
  }
`;

export const StyledHelpGroupHeaderBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

// The adhesion action on the right of the name and description
export const StyledHelpGroupHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
`;

export const StyledHelpGroupHeaderMain = styled.div`
  flex: 1 1 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledHelpGroupTitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 8px;

    & > :first-child {
      flex: 1;
      min-width: 0;
    }
  }
`;

export const StyledHelpGroupMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  color: ${COLORS.darkGray};
`;

export const StyledHelpGroupDescription = styled.div`
  max-width: 720px;

  & > * {
    font-size: 16px;
    line-height: 1.7;
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    & > * {
      font-size: 14px;
    }
  }
`;

export const StyledHelpGroupAdhesion = styled.div`
  flex: none;
`;

/**
 * Two columns on desktop under the header: the information block, the
 * composer and the discussions on the left, « Le cadre » then the emails
 * setting on the right. One column on mobile.
 */
export const StyledHelpGroupPage = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: 32px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const StyledHelpGroupPageMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 16px;
  }
`;

export const StyledHelpGroupPageAside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

export const StyledHelpGroupCharter = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
`;

export const StyledHelpGroupCharterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${COLORS.teal};
`;

export const StyledHelpGroupCharterRules = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    gap: 10px;
  }
`;

export const StyledHelpGroupCharterCheck = styled.span`
  flex: none;
  display: flex;
  padding-top: 3px;
  color: ${COLORS.mediumGreen};
`;

// Mobile: collapsed under the description, expanded on touch
export const StyledHelpGroupCharterDetails = styled.details`
  margin-top: 4px;
  border: 1px solid ${COLORS.gray};
  border-radius: 8px;

  & > ul {
    padding: 0 14px 14px;
    gap: 10px;
  }
`;

export const StyledHelpGroupCharterSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 14px;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  & > :last-child {
    margin-left: auto;
  }
`;

export const StyledHelpGroupCharterSummaryIcon = styled.span`
  display: flex;
  color: ${COLORS.teal};
`;

export const StyledDiscussionsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
  }
`;

export const StyledDiscussionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
  }
`;
