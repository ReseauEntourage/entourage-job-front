import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// Condensed block, at the top of the right column (under the header on mobile)
export const StyledHelpGroupMembers = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 16px;
  }
`;

export const StyledHelpGroupMembersHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

export const StyledHelpGroupMembersPreview = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledHelpGroupMembersPreviewItem = styled.li`
  min-width: 0;
`;

// Full list in the modal
export const StyledHelpGroupMembersModalFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

export const StyledHelpGroupMembersList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
`;

export const StyledHelpGroupMemberRow = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${COLORS.extraLightGray};

  &:last-child {
    border-bottom: none;
  }

  a {
    flex: none;
    color: ${COLORS.darkBlue};
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const StyledHelpGroupMemberIdentity = styled.div`
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
`;

export const StyledHelpGroupMembersEmpty = styled.div`
  padding: 24px 0;
`;
