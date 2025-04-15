import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

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

export const MessagingMessageForm = styled.form<{
  blur?: boolean;
}>`
  display: flex;
  align-items: flex-end;
  background: ${COLORS.lightGray};
  padding: 30px 20px;
  box-sizing: border-box;
  gap: 25px;
  &.mobile {
    position: sticky;
    bottom: 0;
  }
  filter: ${(props) => (props.blur ? 'blur(2px)' : 'none')};
  pointer-events: ${(props) => (props.blur ? 'none' : 'auto')};
`;

export const MessagingInputContainer = styled.div`
  display: flex;
  flex: 1;
  background: ${COLORS.white};
  padding: 15px 20px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 30px;
`;

export const MessagingInput = styled.textarea`
  min-height: 20px;
  max-height: 120px;
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: Poppins, sans-serif;
  padding: 0;
  box-sizing: border-box;
  margin: 0
  box-sizing: border-box;
  background: transparent;
`;
