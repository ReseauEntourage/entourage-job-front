import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${COLORS.hoverBlue};
  border-radius: 20px;
  padding: 18px 20px;
  gap: 20px;
  flex: 1;
  cursor: pointer;
`;

export const StyledConversationMainInfos = styled.div`
  display: flex;
  gap: 20px;
`;

export const StyledConversationParticipants = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-basis: 200px;
  gap: 10px;
  align-items: center;
  font-weight: bold;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex: auto;
  }
`;

export const StyledMessagePreview = styled.div<{ hasSeen: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: auto;
  ${({ hasSeen }) => !hasSeen && `font-weight: 700;`}
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    font-size: 12px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const StyledMessageDate = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-basis: 85px;
  align-items: center;
`;
