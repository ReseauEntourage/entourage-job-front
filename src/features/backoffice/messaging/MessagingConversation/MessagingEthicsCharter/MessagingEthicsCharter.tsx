import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from '@/src/components/ui';
import {
  EthicsCharterSummary,
  getEthicsCharterSummaries,
} from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledMessagingEthicsCharterAcknowledge,
  StyledMessagingEthicsCharterLink,
  StyledMessagingEthicsCharterModal,
  StyledMessagingEthicsCharterModalBody,
  StyledMessagingEthicsCharterModalClose,
  StyledMessagingEthicsCharterModalFooter,
  StyledMessagingEthicsCharterModalHeader,
  StyledMessagingEthicsCharterModalTitle,
  StyledMessagingEthicsCharterNote,
  StyledMessagingEthicsCharterNoteLink,
  StyledMessagingEthicsCharterOverlay,
  StyledMessagingEthicsCharterPoints,
  StyledMessagingEthicsCharterSection,
  StyledMessagingEthicsCharterSectionBody,
  StyledMessagingEthicsCharterSectionIcon,
} from './MessagingEthicsCharter.styles';

const TITLE = "Ici, on se parle d'égal à égal";
const INTRO =
  "Pour des échanges respectueux et sincères, voici ce à quoi chacun s'engage ici.";
const CHARTER_LINK_LABEL = 'Voir la charte complète';
const CHARTER_PATH = '/conseils-posture';
const ACKNOWLEDGE_LABEL = "J'ai compris";
const CLOSE_LABEL = 'Fermer la charte';

const CharterSection = ({ summary }: { summary: EthicsCharterSummary }) => (
  <StyledMessagingEthicsCharterSection>
    <StyledMessagingEthicsCharterSectionIcon>
      <LucidIcon name={summary.icon} color={COLORS.darkTeal} />
    </StyledMessagingEthicsCharterSectionIcon>
    <StyledMessagingEthicsCharterSectionBody>
      <Text weight="semibold">{summary.title}</Text>
      <StyledMessagingEthicsCharterPoints>
        {summary.points.map((point) => (
          <li key={point}>
            <Text>{point}</Text>
          </li>
        ))}
      </StyledMessagingEthicsCharterPoints>
    </StyledMessagingEthicsCharterSectionBody>
  </StyledMessagingEthicsCharterSection>
);

export const MessagingEthicsCharter = () => {
  // La modale s'ouvre à l'ouverture de la conversation. Sa fermeture n'est pas
  // persistée : le parent remonte ce composant à chaque changement de
  // conversation (`key`), et un rechargement la rouvre.
  const [isModalOpen, setIsModalOpen] = useState(true);
  const summaries = getEthicsCharterSummaries();
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    modalRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  return (
    <>
      <StyledMessagingEthicsCharterNote data-testid="messaging-ethics-charter-note">
        <LucidIcon name="Info" size={14} color={COLORS.darkGray} />
        <Text size="small" color="darkGray">
          Vos échanges doivent suivre la{' '}
          <StyledMessagingEthicsCharterNoteLink
            href={CHARTER_PATH}
            target="_blank"
            rel="noopener noreferrer"
          >
            charte éthique
          </StyledMessagingEthicsCharterNoteLink>{' '}
          d&apos;Entourage Pro
        </Text>
      </StyledMessagingEthicsCharterNote>

      {isModalOpen && (
        <StyledMessagingEthicsCharterOverlay>
          <StyledMessagingEthicsCharterModal
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={TITLE}
            tabIndex={-1}
            data-testid="messaging-ethics-charter-modal"
          >
            <StyledMessagingEthicsCharterModalHeader>
              <StyledMessagingEthicsCharterModalTitle>
                <Text weight="semibold" size="xxlarge">
                  {TITLE}
                </Text>
                <Text>{INTRO}</Text>
              </StyledMessagingEthicsCharterModalTitle>
              <StyledMessagingEthicsCharterModalClose
                type="button"
                onClick={closeModal}
                aria-label={CLOSE_LABEL}
              >
                <LucidIcon name="X" size={20} color={COLORS.extraDarkGray} />
              </StyledMessagingEthicsCharterModalClose>
            </StyledMessagingEthicsCharterModalHeader>

            <StyledMessagingEthicsCharterModalBody>
              {summaries.map((summary) => (
                <CharterSection key={summary.title} summary={summary} />
              ))}
            </StyledMessagingEthicsCharterModalBody>

            <StyledMessagingEthicsCharterModalFooter>
              <StyledMessagingEthicsCharterLink
                href={CHARTER_PATH}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text>{CHARTER_LINK_LABEL}</Text>
                <LucidIcon
                  name="ExternalLink"
                  size={14}
                  color={COLORS.extraDarkGray}
                />
              </StyledMessagingEthicsCharterLink>
              <StyledMessagingEthicsCharterAcknowledge
                type="button"
                onClick={closeModal}
              >
                {ACKNOWLEDGE_LABEL}
              </StyledMessagingEthicsCharterAcknowledge>
            </StyledMessagingEthicsCharterModalFooter>
          </StyledMessagingEthicsCharterModal>
        </StyledMessagingEthicsCharterOverlay>
      )}
    </>
  );
};
