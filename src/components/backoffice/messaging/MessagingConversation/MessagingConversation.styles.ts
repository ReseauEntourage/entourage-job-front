import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const MessagingConversationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 450px;
  flex-grow: 1;
  border: ${COLORS.lightgray} 1px solid;
  box-sizing: border-box;
  &:not(.mobile) {
    border-radius: 30px 30px 5px 5px;
  }
`;

export const MessagingMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  height: 450px;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-start;
`;

export const MessagingMessageForm = styled.form`
  display: flex;
  align-items: center;
  background: ${COLORS.lightgray};
  padding: 30px 20px;
`;
