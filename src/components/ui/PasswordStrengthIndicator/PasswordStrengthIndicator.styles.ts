import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

const STRENGTH_COLORS = [
  COLORS.orangeSocial,
  COLORS.amber,
  COLORS.darkYellow,
  '#22c55e',
];

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
`;

export const StyledBars = styled.div`
  display: flex;
  gap: 4px;
`;

export const StyledBar = styled.div<{ active: boolean; strengthIndex: number }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ active, strengthIndex }) =>
    active ? STRENGTH_COLORS[strengthIndex] ?? COLORS.gray : COLORS.gray};
  transition: background-color 0.2s ease;
`;

export const StyledLabel = styled.span<{ strengthIndex: number }>`
  font-size: 12px;
  color: ${({ strengthIndex }) => STRENGTH_COLORS[strengthIndex] ?? COLORS.mediumGray};
`;
