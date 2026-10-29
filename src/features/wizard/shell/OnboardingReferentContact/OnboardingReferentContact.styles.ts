import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// Desktop only: on mobile OnboardingHelpLink takes over. margin-left: auto
// keeps the button pinned to the right of its row whether or not a sibling
// (the step sub-progress label, or nothing on a headerless step) precedes it.
export const StyledOnboardingReferentContact = styled.div`
  position: relative;
  margin-left: auto;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledOnboardingReferentContactToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.teal};
  background: ${COLORS.extraLightTeal};
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    background: ${COLORS.hoverBlue};
  }

  &:focus-visible {
    outline: 2px solid ${COLORS.primaryBlue};
    outline-offset: 2px;
  }
`;

export const StyledOnboardingReferentContactDialog = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  box-sizing: border-box;
  background: ${COLORS.white};
  border-radius: 10px;
  box-shadow: ${SHADOWS.dropdown};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
`;

export const StyledOnboardingReferentContactBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledOnboardingReferentContactPicture = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
`;

export const StyledOnboardingReferentContactText = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 0;
  }

  // Keep the email as discreet as the rest of the dialog (SimpleLink is blue by default).
  a {
    color: ${COLORS.darkGray};
    text-decoration: underline;
  }
`;
