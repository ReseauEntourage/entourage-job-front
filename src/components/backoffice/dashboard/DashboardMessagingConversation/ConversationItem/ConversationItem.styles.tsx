import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  background: ${COLORS.hoverBlue};
  padding: 18px 20px;
  gap: 20px;
  flex: 1;
  cursor: pointer;
  align-items: center;
`;

export const StyledConversationParticipants = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-basis: 200px;
  gap: 10px;
  align-items: center;
  font-weight: bold;
`;

export const StyledMessagePreview = styled.div<{ hasSeen: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: auto;
  ${({ hasSeen }) => !hasSeen && `font-weight: 700;`}
`;

export const StyledMessageDate = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-basis: 85px;
  align-items: center;
`;
