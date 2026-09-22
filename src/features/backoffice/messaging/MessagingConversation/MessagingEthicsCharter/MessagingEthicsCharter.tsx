import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import {
  EthicsCharterSummary,
  getEthicsCharterSummaries,
} from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { DocumentNames, ReduxRequestEvents } from '@/src/constants';
import { COLORS } from '@/src/constants/styles';
import { Modal, ModalContext } from '@/src/features/modals/Modal';
import { isReadDocument } from '@/src/features/partials/pages/Documents/Documents.utils';
import { useCurrentUserReadDocuments } from '@/src/hooks/current-user/useCurrentUserReadDocuments';
import {
  currentUserActions,
  selectFetchCurrentReadDocumentsStatus,
} from '@/src/use-cases/current-user';
import {
  StyledMessagingEthicsCharterAcknowledge,
  StyledMessagingEthicsCharterLink,
  StyledMessagingEthicsCharterModalBody,
  StyledMessagingEthicsCharterModalFooter,
  StyledMessagingEthicsCharterModalHeader,
  StyledMessagingEthicsCharterNote,
  StyledMessagingEthicsCharterNoteLink,
  StyledMessagingEthicsCharterPoints,
  StyledMessagingEthicsCharterSection,
  StyledMessagingEthicsCharterSectionBody,
  StyledMessagingEthicsCharterSectionIcon,
} from './MessagingEthicsCharter.styles';

const MODAL_ID = 'messaging-ethics-charter-modal';
const TITLE = "Ici, on se parle d'égal à égal";
const INTRO =
  "Pour des échanges respectueux et sincères, voici ce à quoi chacun s'engage ici.";
const CHARTER_LINK_LABEL = 'Voir la charte complète';
const CHARTER_PATH = '/conseils-posture';
const ACKNOWLEDGE_LABEL = "J'ai compris";

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
  const dispatch = useDispatch();
  const readDocuments = useCurrentUserReadDocuments();
  const readDocumentsStatus = useSelector(
    selectFetchCurrentReadDocumentsStatus
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const summaries = getEthicsCharterSummaries();

  /**
   * La modale ne s'ouvre qu'une fois par utilisateur : elle attend que la
   * liste des documents lus soit chargée — sans quoi elle s'afficherait un
   * instant à quelqu'un qui l'a déjà vue — puis vérifie l'absence du document
   * `CharteEthique`.
   */
  const isModalOpen =
    !isDismissed &&
    readDocumentsStatus === ReduxRequestEvents.SUCCEEDED &&
    !isReadDocument(readDocuments, DocumentNames.CharteEthique);

  const closeModal = useCallback(() => setIsDismissed(true), []);

  /**
   * Seul « J'ai compris » mémorise : la croix et Échap referment pour cette
   * fois. Le rafraîchissement de la liste évite que la modale se rouvre au
   * changement de conversation, où le composant est remonté.
   */
  const acknowledge = useCallback(() => {
    dispatch(
      currentUserActions.readDocumentRequested({
        documentName: DocumentNames.CharteEthique,
      })
    );
    dispatch(currentUserActions.fetchCurrentReadDocumentsRequested());
    setIsDismissed(true);
  }, [dispatch]);

  /**
   * La modale du produit est rendue ici, sous son propre contexte, plutôt
   * qu'émise par `openModal()` : elle s'ouvre au montage et doit disparaître
   * au démontage, au changement de conversation notamment. `openModal` empile
   * les modales et n'en referme aucune de l'extérieur.
   */
  const modalContextValue = useMemo(
    () => ({ onClose: closeModal }),
    [closeModal]
  );

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
        <ModalContext.Provider value={modalContextValue}>
          <Modal id={MODAL_ID} size="medium" ariaLabel={TITLE} withCloseButton>
            <StyledMessagingEthicsCharterModalHeader>
              <Text weight="semibold" size="xxlarge">
                {TITLE}
              </Text>
              <Text>{INTRO}</Text>
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
                onClick={acknowledge}
              >
                {ACKNOWLEDGE_LABEL}
              </StyledMessagingEthicsCharterAcknowledge>
            </StyledMessagingEthicsCharterModalFooter>
          </Modal>
        </ModalContext.Provider>
      )}
    </>
  );
};
