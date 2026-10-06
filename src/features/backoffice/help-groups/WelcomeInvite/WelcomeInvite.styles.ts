import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledWelcomeInvite = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 20px;
  background-color: ${COLORS.extraLightOrange};
  text-align: left;
  cursor: pointer;
`;

export const StyledFirstResponderInvite = styled.div`
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${COLORS.extraLightOrange};
`;
