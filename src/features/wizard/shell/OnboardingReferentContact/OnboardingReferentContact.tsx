import React from 'react';
import { LegacyImg, SimpleLink } from '@/src/components/ui';
import { Text } from '@/src/components/ui/Text';
import {
  StyledOnboardingReferentContact,
  StyledOnboardingReferentContactBody,
  StyledOnboardingReferentContactPicture,
  StyledOnboardingReferentContactText,
} from './OnboardingReferentContact.styles';
import { useOnboardingReferentContact } from './useOnboardingReferentContact';

/**
 * Discreet referent contact shown under the step actions on desktop. Renders
 * nothing while the contact is loading or when none is available.
 */
export const OnboardingReferentContact = () => {
  const referent = useOnboardingReferentContact();

  if (!referent) {
    return null;
  }

  const { contact, zoneLabel } = referent;

  return (
    <StyledOnboardingReferentContact data-testid="onboarding-referent-contact">
      <Text size="small" color="darkGray">
        Une question ? Besoin d&apos;aide ?
      </Text>
      <StyledOnboardingReferentContactBody>
        <StyledOnboardingReferentContactPicture>
          <LegacyImg src={contact.img} alt={contact.name} cover />
        </StyledOnboardingReferentContactPicture>
        <StyledOnboardingReferentContactText>
          <Text size="small">
            <strong>{contact.name}</strong> · Référent(e) Entourage Pro{' '}
            {zoneLabel}
          </Text>
          <Text size="small" color="darkGray">
            <SimpleLink isExternal href={`mailto:${contact.email}`}>
              {contact.email}
            </SimpleLink>
          </Text>
        </StyledOnboardingReferentContactText>
      </StyledOnboardingReferentContactBody>
    </StyledOnboardingReferentContact>
  );
};
