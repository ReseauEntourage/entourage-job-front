import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
`;

/**
 * Desktop-only wrapper for the sub-progress badge: `WizardMobileStepHeader`
 * already renders the same badge, mobile-only, so this avoids showing it
 * twice at the same breakpoint. Also carries the onboarding referent contact
 * button, pinned to the right by its own `margin-left: auto`.
 */
export const StyledDesktopSubProgress = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;
