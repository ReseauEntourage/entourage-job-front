import styled from 'styled-components';
import { Color, COLORS } from '@/src/constants/styles';

const COUNTER_SIZE = 50;
const LINE_HEIGHT = 2;
const BORDER_WIDTH = 3;

export const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

export const StyledLine = styled.div`
  position: absolute;
  top: ${COUNTER_SIZE / 2}px;
  left: 0;
  right: 0;
  height: ${LINE_HEIGHT}px;
  background-color: ${COLORS.gray};
  width: 100%;
  z-index: -1;
`;

export const StyledItemContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  z-index: 1;
`;

// Ajout d'une prop $isLast pour gérer le flex
export const StyledItem = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-start;
  max-width: 220px;
  ${({ isLast }) => !isLast && 'flex: 1;'}
`;

export const StyledItemCounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const StyledItemCounter = styled.div<{
  active?: boolean;
  activeColor?: Color;
}>`
  width: ${COUNTER_SIZE}px;
  height: ${COUNTER_SIZE}px;
  border-radius: 50%;
  background-color: ${COLORS.white};
  border: ${BORDER_WIDTH}px solid
    ${({ active, activeColor }) => (active ? COLORS[activeColor] : COLORS.gray)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledItemContent = styled.div`
  display: flex;
`;
