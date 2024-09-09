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
  align-items: flex-end;
  background: ${COLORS.lightgray};
  padding: 30px 20px;
  gap: 25px;
`;

export const MessagingInputContainer = styled.div`
  display: flex;
  flex: 1;
  background: ${COLORS.white};
  padding: 15px 20px;
  width: 100%;
  border-radius: 30px;
`;

export const MessagingInput = styled.textarea`
  // Make the textarea 1 line but can grow with the content max 4 lines
  min-height: 20px;
  max-height: 120px;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: Poppins, sans-serif;
  padding: 0;
  margin: 0
  box-sizing: border-box;
  background: transparent;
`;
