import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledSequencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
`;

export const StyledIndex = styled.div`
  border-radius: 50%;
  background-color: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
`;
