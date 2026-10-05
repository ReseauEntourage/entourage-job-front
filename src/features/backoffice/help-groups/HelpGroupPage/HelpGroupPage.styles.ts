import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledHelpGroupHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledUnpublishedMention = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${COLORS.lightYellow};
  color: ${COLORS.amber};
  font-size: 12px;
  font-weight: 600;
`;

export const StyledHelpGroupCharter = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px;
  border-radius: 20px;
  background-color: ${COLORS.hoverBlue};
`;

export const StyledHelpGroupCharterRules = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledDiscussionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledDiscussionListEmpty = styled.div`
  padding: 40px 0;
  text-align: center;
`;
