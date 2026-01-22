import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledElearningUnitModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledElearningUnitModalHeader = styled.div`
  padding: 16px;
`;

export const StyledElearningUnitModalContent = styled.div<{
  noPadding?: boolean;
}>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.noPadding ? '0' : '16px')};
  gap: 16px;
`;

export const StyledQuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledElearningQuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 0 16px;
  margin-top: 16px;
  border: 2px solid ${COLORS.gray};
  border-radius: 8px;
`;

export const StyledElearningUnitModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  gap: 8px;
`;

export const StyledElearningUnitModalQuizSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: stretch;
  align-items: stretch;
  padding: 15px;
`;
