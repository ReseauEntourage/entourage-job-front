import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMembershipActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const StyledJustJoined = styled.span`
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${COLORS.hoverBlue};
  color: ${COLORS.primaryBlue};
  font-size: 12px;
  font-weight: 600;
`;
