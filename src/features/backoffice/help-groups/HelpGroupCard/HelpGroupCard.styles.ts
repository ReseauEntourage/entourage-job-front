import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const StyledHelpGroupCardLink = styled.div`
  height: 100%;

  a {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }
`;

export const StyledHelpGroupCardDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledHelpGroupCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
`;

export const StyledHelpGroupContributors = styled.div`
  display: flex;

  & > * + * {
    margin-left: -8px;
  }
`;

export const StyledHelpGroupMemberMention = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${COLORS.hoverBlue};
  color: ${COLORS.darkTeal};
  font-size: 12px;
`;
