import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

// The whole card leads to the discussion: the title link is stretched over
// it (see StyledDiscussionRowTitle), so the card holds a single link
export const StyledDiscussionRow = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  background-color: ${COLORS.white};

  &:hover {
    border-color: ${COLORS.primaryBlue};
  }
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
      border-radius: 16px;
    }
  }
`;

// Kept above the stretched title link, so that the author's name still leads
// to their profile, and only as wide as its content
export const StyledDiscussionRowAuthor = styled.div`
  position: relative;
  z-index: 1;
  align-self: flex-start;
`;

export const StyledDiscussionRowFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;
