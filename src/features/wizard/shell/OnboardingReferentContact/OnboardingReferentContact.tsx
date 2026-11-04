import React, { useEffect, useRef, useState } from 'react';
import { LegacyImg, SimpleLink } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { Text } from '@/src/components/ui/Text';
import {
  StyledOnboardingReferentContact,
  StyledOnboardingReferentContactBody,
  StyledOnboardingReferentContactDialog,
  StyledOnboardingReferentContactPicture,
  StyledOnboardingReferentContactText,
  StyledOnboardingReferentContactToggle,
} from './OnboardingReferentContact.styles';
import { useOnboardingReferentContact } from './useOnboardingReferentContact';

/**
 * Desktop « Besoin d'aide ? » button: always visible, above the fold.
 * Clicking it reveals a dialog with the referent contact. Renders nothing
 * while the contact is loading or when none is available.
 */
export const OnboardingReferentContact = () => {
  const referent = useOnboardingReferentContact();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!referent) {
    return null;
  }

  const { contact, zoneLabel } = referent;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <StyledOnboardingReferentContact
      ref={containerRef}
      onKeyDown={handleKeyDown}
      data-testid="onboarding-referent-contact"
    >
      <StyledOnboardingReferentContactToggle
        ref={toggleRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((open) => !open)}
      >
        <LucidIcon name="CircleHelp" size={16} />
        Besoin d&apos;aide ?
      </StyledOnboardingReferentContactToggle>
      {isOpen && (
        <StyledOnboardingReferentContactDialog
          role="dialog"
          aria-label="Contacter votre référent(e)"
        >
          <Text size="small" color="darkGray">
            Une question ? Contactez votre référent(e)
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
        </StyledOnboardingReferentContactDialog>
      )}
    </StyledOnboardingReferentContact>
  );
};
