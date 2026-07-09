import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
`;

export const StyledRoundBadge = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed ${COLORS.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${COLORS.hoverBlue};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
`;
