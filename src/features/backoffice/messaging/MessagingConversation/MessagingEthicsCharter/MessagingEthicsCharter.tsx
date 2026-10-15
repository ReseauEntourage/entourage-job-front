import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import {
  ETHICS_CHARTER_SUMMARIES_INTRO,
  ETHICS_CHARTER_SUMMARIES_TITLE,
  EthicsCharterSummaries,
} from '@/src/components/ui/EthicsCharter/EthicsCharterSummaries';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { DocumentNames, ReduxRequestEvents } from '@/src/constants';
import { COLORS } from '@/src/constants/styles';
import { ModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { isReadDocument } from '@/src/features/partials/pages/Documents/Documents.utils';
import { useCurrentUserReadDocuments } from '@/src/hooks/current-user/useCurrentUserReadDocuments';
import {
  currentUserActions,
  selectFetchCurrentReadDocumentsStatus,
} from '@/src/use-cases/current-user';
import {
  StyledMessagingEthicsCharterLink,
  StyledMessagingEthicsCharterNote,
  StyledMessagingEthicsCharterNoteLink,
} from './MessagingEthicsCharter.styles';

const MODAL_ID = 'messaging-ethics-charter-modal';
const TITLE = ETHICS_CHARTER_SUMMARIES_TITLE;
const INTRO = ETHICS_CHARTER_SUMMARIES_INTRO;
const CHARTER_LINK_LABEL = 'Voir la charte complète';
const CHARTER_PATH = '/conseils-posture';
const ACKNOWLEDGE_LABEL = "J'ai compris";

export const MessagingEthicsCharter = () => {
  const dispatch = useDispatch();
  const readDocuments = useCurrentUserReadDocuments();
  const readDocumentsStatus = useSelector(
    selectFetchCurrentReadDocumentsStatus
  );
  const [isDismissed, setIsDismissed] = useState(false);

  /**
   * The modal opens only once per user: it waits for the read documents to be
   * loaded — otherwise it would flash at someone who has already seen it —
   * then checks that the `CharteEthique` document is absent.
   */
  const isModalOpen =
    !isDismissed &&
    readDocumentsStatus === ReduxRequestEvents.SUCCEEDED &&
    !isReadDocument(readDocuments, DocumentNames.CharteEthique);

  const closeModal = useCallback(() => setIsDismissed(true), []);

  /**
   * Only "J'ai compris" remembers: the cross and Escape close it for this time
   * only. Recording the document immediately completes the local read
   * documents, which keeps the modal closed when the component is remounted —
   * on a conversation change in particular.
   */
  const acknowledge = useCallback(() => {
    dispatch(
      currentUserActions.readDocumentRequested({
        documentName: DocumentNames.CharteEthique,
      })
    );
    setIsDismissed(true);
  }, [dispatch]);

  /**
   * The product modal is rendered here, under its own context, rather than
   * emitted through `openModal()`: it opens on mount and must disappear on
   * unmount, on a conversation change in particular. `openModal` stacks modals
   * and closes none of them from the outside.
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
          <ModalGeneric
            id={MODAL_ID}
            size="medium"
            ariaLabel={TITLE}
            title={TITLE}
            description={INTRO}
            align="left"
            footer={
              <>
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
                <Button
                  variant="heroPrimary"
                  onClick={acknowledge}
                  dataTestId="messaging-ethics-charter-acknowledge"
                >
                  {ACKNOWLEDGE_LABEL}
                </Button>
              </>
            }
          >
            <EthicsCharterSummaries />
          </ModalGeneric>
        </ModalContext.Provider>
      )}
    </>
  );
};
