import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  background: ${COLORS.hoverBlue};
  padding: 18px 20px;
  gap: 15px;
  flex: 1;
  cursor: pointer;
`;

export const StyledConversationParticipants = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: bold;
  width: 275px;
`;

export const StyledMessagePreview = styled.div<{ hasSeen: boolean }>`
  display: flex;
  align-items: center;
  flex: auto;
  ${({ hasSeen }) => !hasSeen && `font-weight: 700;`}
`;

export const StyledMessageDate = styled.div`
  display: flex;
  align-items: center;
`;
