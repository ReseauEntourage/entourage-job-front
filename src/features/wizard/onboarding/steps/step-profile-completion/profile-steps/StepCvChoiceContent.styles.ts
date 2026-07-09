import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledDropZone = styled.div<{ $isDragOver: boolean }>`
  border: 2px dashed
    ${({ $isDragOver }) => ($isDragOver ? COLORS.primaryBlue : COLORS.gray)};
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: ${({ $isDragOver }) =>
    $isDragOver ? `${COLORS.primaryBlue}15` : 'transparent'};
  transition: background 0.15s, border-color 0.15s;
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledHelpText = styled.div`
  text-align: center;
`;
