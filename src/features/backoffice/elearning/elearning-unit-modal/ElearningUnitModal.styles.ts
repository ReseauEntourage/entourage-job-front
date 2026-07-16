import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledElearningUnitModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 18px;
`;

export const StyledElearningUnitModalBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const StyledInviteToGoToQuiz = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  padding: 10px 15px;
  background-color: ${COLORS.hoverBlue};
  flex-shrink: 0;
`;

export const StyledElearningUnitModalActions = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 30px;
  margin-top: 16px;
  gap: 8px;
  flex-shrink: 0;
`;
