import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const MessagingPanelSidebarContainer = styled.div`
  width: 40px;
  border-left: 1px solid ${COLORS.lightGray};
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  background: ${COLORS.white};
`;

export const PanelSidebarButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.mediumGray};
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${COLORS.primaryBlue};
    background: #f0f4ff;
  }
`;

export const PanelSidebarLabel = styled.span`
  font-size: 11px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
`;

export const MessagingConversationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const MessagingConversationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 450px;
  flex-grow: 1;
  border: ${COLORS.lightGray} 1px solid;
  box-sizing: border-box;
  height: 100%;
`;

export const MessagingConversationAIPanel = styled.div`
  width: 40%;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
`;

export const MessagingMessagesContainer = styled.div<{
  blur?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-start;
  flex: auto;
  filter: ${(props) => (props.blur ? 'blur(2px)' : 'none')};
  pointer-events: ${(props) => (props.blur ? 'none' : 'auto')};
`;
