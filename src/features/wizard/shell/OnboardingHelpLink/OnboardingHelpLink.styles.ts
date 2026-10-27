import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

// Mobile only: on desktop the referent contact block is shown instead.
export const StyledOnboardingHelpLink = styled.div`
  display: none;
  margin-left: auto;

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    color: ${COLORS.darkGray};
    font-size: 12px;
    text-decoration: underline;
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: flex;
  }
`;
