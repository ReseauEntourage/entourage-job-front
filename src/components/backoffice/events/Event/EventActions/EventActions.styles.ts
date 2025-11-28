import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledStatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledStatusBadge = styled.div<{ enabled?: boolean }>`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${({ enabled }) =>
    enabled ? COLORS.primaryBlue : COLORS.lightGray};
  color: ${({ enabled }) => (enabled ? COLORS.white : COLORS.darkGray)};
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
