import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMessageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledMessageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

// Location and profile link of the author in the header of the original
// message, below the desktop breakpoint: on their own line
export const StyledAuthorDetails = styled.div`
  display: flex;
  flex: 1 1 100%;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;

  /* Keep each separator on the same line as its item, even when the item wraps a block Text */
  & > * {
    display: inline-flex;
    align-items: center;
  }

  & > * > * {
    margin: 0;
  }

  & > * + *::before {
    content: '·';
    margin-right: 8px;
    color: ${COLORS.darkGray};
  }

  a {
    text-decoration: none;
  }
`;

export const StyledMessageFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const StyledMessageEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledMessageEditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

// Mention of a message hidden after reports, for its author or instead of it
export const StyledUnderReviewMention = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${COLORS.extraLightGray};
  font-style: italic;
`;

// What an admin sees above a message hidden after reports
export const StyledHiddenByReportsBanner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${COLORS.extraLightRed};
`;

export const StyledHiddenByReportsText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledHiddenByReportsActions = styled.div`
  display: flex;
  gap: 8px;
`;
