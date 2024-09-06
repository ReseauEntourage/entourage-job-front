import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const MessagingConversationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  flex-basis: 50vh;
  flex-grow: 1;
  border: ${COLORS.lightgray} 1px solid;
  border-radius: 30px 30px 5px 5px;
`;
