import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// A card carries a shadow or a border, never both
export const StyledHelpGroupCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 250px;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${SHADOWS.cardHover};
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 12px;
    min-height: 0;
    padding: 20px;
  }
`;

// The whole card is a single link to the group
export const StyledHelpGroupCardLink = styled.div`
  height: 100%;

  a {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }
`;

// Same height on every desktop card, so that the names line up
export const StyledHelpGroupCardBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 26px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-height: 0;

    &:empty {
      display: none;
    }
  }
`;

export const StyledHelpGroupCardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 4px;
  }
`;

// 3 lines on desktop, 2 on mobile
export const StyledHelpGroupCardDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    -webkit-line-clamp: 2;
  }
`;

export const StyledHelpGroupCardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.extraLightGray};
  color: ${COLORS.darkBlue};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
    padding-top: 12px;
  }
`;

export const StyledHelpGroupCardMembers = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StyledHelpGroupContributors = styled.div`
  display: flex;
  padding-right: 8px;

  & > * + * {
    margin-left: -8px;
  }
`;
