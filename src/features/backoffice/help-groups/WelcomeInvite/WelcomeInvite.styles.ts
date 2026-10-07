import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledWelcomeInvite = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 10px;
  background-color: ${COLORS.extraExtraLightOrange};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px;
  }
`;

export const StyledWelcomeInviteText = styled.div`
  flex: 1 1 320px;
  min-width: 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex: none;
  }
`;

export const StyledFirstResponderInvite = styled.div`
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${COLORS.extraLightOrange};
`;
