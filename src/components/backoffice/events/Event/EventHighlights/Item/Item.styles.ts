import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledItemContainer = styled.div`
  background: ${COLORS.hoverBlue};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 8px;
  background-color: ${COLORS.white};
  flex-shrink: 0;
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`;
