import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// The whole card leads to the discussion: the title link is stretched over
// it (see StyledDiscussionRowTitle), so the card holds a single link
export const StyledDiscussionRow = styled.article`
  position: relative;
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 8px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${SHADOWS.cardHover};
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 16px;
  }
`;

// Hidden on mobile, as in the design
export const StyledDiscussionRowAvatar = styled.div`
  flex: none;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledDiscussionRowContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledDiscussionRowTitle = styled.div`
  overflow-wrap: anywhere;

  a {
    color: ${COLORS.black};
    text-decoration: none;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
    }
  }
`;

// "Author · role · date". The author's name is kept above the stretched
// title link, so that it still leads to their profile.
export const StyledDiscussionRowMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 6px;
  color: ${COLORS.darkGray};
`;

export const StyledDiscussionRowAuthor = styled.div`
  position: relative;
  z-index: 1;

  a {
    color: ${COLORS.black};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const StyledDiscussionRowFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 20px;
`;

export const StyledDiscussionRowReplies = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${COLORS.darkBlue};
`;
