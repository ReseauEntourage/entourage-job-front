import styled from 'styled-components';

export const MessagingSuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  flex: auto;
  gap: 30px;
  justify-content: center;
`;

export const MessagingSuggestionsExplanation = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;

  h3 {
    margin: 0;
  }
  p {
    margin: 0;
    text-align: center;
  }
`;

export const MessagingSuggestionsListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
`;
