import { styled } from 'styled-components';
import { COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledHelpGroupAdminTableCard = styled.div`
  padding: 8px 16px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
`;

export const StyledHelpGroupAdminCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
