import React from 'react';
import { SimpleLink } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { useOnboardingReferentContact } from '../OnboardingReferentContact';
import { StyledOnboardingHelpLink } from './OnboardingHelpLink.styles';

/**
 * Mobile « Besoin d'aide ? » link that opens an email to the referent.
 * Renders nothing while the contact is loading or when none is available.
 */
export const OnboardingHelpLink = () => {
  const referent = useOnboardingReferentContact();

  if (!referent) {
    return null;
  }

  return (
    <StyledOnboardingHelpLink data-testid="onboarding-help-link">
      <SimpleLink isExternal href={`mailto:${referent.contact.email}`}>
        <LucidIcon name="CircleHelp" size={14} />
        Besoin d&apos;aide ?
      </SimpleLink>
    </StyledOnboardingHelpLink>
  );
};
