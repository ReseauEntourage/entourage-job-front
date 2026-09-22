import { styled } from 'styled-components';

export const MessagingSuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  flex: auto;
  gap: 20px;
  justify-content: flex-start;
`;

export const MessagingSuggestionsListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
`;

export const MessagingQuickRepliesContainer = styled.div`
  display: flex;
  padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const MessagingQuickRepliesListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;
