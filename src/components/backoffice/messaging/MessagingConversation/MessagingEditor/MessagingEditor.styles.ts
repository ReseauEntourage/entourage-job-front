import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const MessagingEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${COLORS.lightGray};
  padding: 20px 20px 30px 20px;
  gap: 10px;
  box-sizing: border-box;
  &.mobile {
    position: sticky;
    bottom: 0;
  }
`;

export const StyledAttachementInfoContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const MessagingMessageForm = styled.form`
  display: flex;
  gap: 25px;
  align-items: flex-end;
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
