import { styled } from 'styled-components';

export const StyledOnboardingStepContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledOnboardingActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
`;

/**
 * Safety-net row for OnboardingReferentContact on the steps that hide the
 * generic header (so HeaderWizardStep, which normally carries the button,
 * never renders). The button pins itself to the right via margin-left: auto.
 */
export const StyledOnboardingReferentContactFallbackRow = styled.div`
  display: flex;
  width: 100%;
`;
