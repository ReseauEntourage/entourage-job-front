import { styled } from 'styled-components';

/**
 * Compact strip hugging the editor, on the quick replies model: it hugs the
 * height of its content instead of taking over the message thread area, which
 * stays empty as long as no message has been exchanged.
 */
export const MessagingSuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const MessagingSuggestionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MessagingSuggestionsListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
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
