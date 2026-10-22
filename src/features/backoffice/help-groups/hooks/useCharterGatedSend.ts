import React, { useCallback } from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { HelpGroupsWriteError } from '@/src/use-cases/help-groups';
import { CharterModal } from '../CharterModal';

type SendResult = { error?: HelpGroupsWriteError | unknown };

/**
 * Sends a discussion or a reply, presenting the charter first when the
 * person never accepted it. A 409 from the back (charter accepted on
 * another device state, stale page) opens the charter as a safety net.
 */
export const useCharterGatedSend = (
  charterAccepted: boolean,
  send: (acceptCharter: boolean) => Promise<SendResult>
) =>
  useCallback(async () => {
    const sendWithCharter = () => {
      send(true);
    };
    if (!charterAccepted) {
      openModal(
        React.createElement(CharterModal, { onAccept: sendWithCharter })
      );
      return;
    }
    const result = await send(false);
    if (result.error === HelpGroupsWriteError.CHARTER_NOT_ACCEPTED) {
      openModal(
        React.createElement(CharterModal, { onAccept: sendWithCharter })
      );
    }
  }, [charterAccepted, send]);
