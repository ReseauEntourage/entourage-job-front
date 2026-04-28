import styled, { keyframes } from 'styled-components';
import { sizesPx } from '@/src/components/ui/Text/Text.utils';
import { COLORS } from 'src/constants/styles';

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const AIPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${COLORS.white};
  border-left: 1px solid ${COLORS.lightGray};
  overflow: hidden;
  animation: ${slideInFromRight} 0.3s ease-out;
`;

export const AIPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 4px;
  border-bottom: 1px solid ${COLORS.lightGray};
  flex-shrink: 0;
  gap: 8px;
`;

export const PanelTabBar = styled.div`
  display: flex;
  flex: 1;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface PanelTabProps {
  isActive: boolean;
}

export const PanelTab = styled.button<PanelTabProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 12px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) => (isActive ? COLORS.primaryBlue : 'transparent')};
  color: ${({ isActive }) =>
    isActive ? COLORS.primaryBlue : COLORS.mediumGray};
  font-size: 13px;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${COLORS.primaryBlue};
  }
`;

export const AIMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  gap: 12px;
`;

export const AIEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: ${COLORS.mediumGray};
  text-align: center;
  padding: 24px;

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  }
`;

interface AIMessageBubbleProps {
  role: 'user' | 'assistant';
}

export const AIMessageBubble = styled.div<AIMessageBubbleProps>`
  display: flex;
  flex-direction: column;
  max-width: 90%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;

  ${({ role }) =>
    role === 'user'
      ? `
    align-self: flex-end;
    background: ${COLORS.primaryBlue};
    color: ${COLORS.white};
    border-bottom-right-radius: 4px;
    white-space: pre-wrap;
  `
      : `
    align-self: flex-start;
    background: ${COLORS.lightGray};
    color: ${COLORS.black};
    border-bottom-left-radius: 4px;
  `}
`;

export const AIMarkdownContent = styled.div<{ $device: 'mobile' | 'desktop' }>`
  font-size: ${({ $device }) => sizesPx[$device]['normal']}px;
  line-height: 1.6;

  p {
    margin: 0 0 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    margin: 4px 0 8px;
    padding-left: 18px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  li {
    margin-bottom: 2px;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
    color: ${COLORS.darkGray};
  }

  h1,
  h2,
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 8px 0 4px;
    &:first-child {
      margin-top: 0;
    }
  }

  code {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 14px;
    font-family: monospace;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    margin: 8px 0;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
`;

export const AILoadingIndicator = styled.div`
  display: flex;
  align-self: flex-start;
  background: ${COLORS.lightGray};
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  padding: 12px 16px;
  gap: 5px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${COLORS.mediumGray};
    display: inline-block;
    animation: ${bounce} 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export const AIQuickActionsContainer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${COLORS.lightGray};
  flex-shrink: 0;
`;

export const AIQuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
`;

export const AIChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 16px 4px;
  flex-shrink: 0;
`;

export const AIChatInputWrapper = styled.div`
  display: flex;
  flex: 1;
  background: ${COLORS.white};
  padding: 10px 14px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.gray};
  border-radius: 8px;

  &:focus-within {
    border-color: ${COLORS.primaryBlue};
  }
`;

export const AIEscalateCard = styled.div`
  margin: 0 16px;
  padding: 12px 14px;
  background: #fff8f0;
  border: 1px solid #f5a623;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

export const AIEscalateCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AISuggestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
