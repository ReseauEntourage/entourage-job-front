import React from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { formEditEmployed } from 'src/components/forms/schema/formEditEmployed';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';

interface CandidateEmployedToggleProps {
  candidateId: string;
  title?: string;
  subtitle: JSX.Element | string;
  modalTitle: string;
  modalConfirmation: string;
  notificationMessage: string;
  defaultValue: boolean;
  setData: (updatedData: {
    contract: string;
    endOfContract: string;
    employed: boolean;
  }) => void;
}

export const CandidateEmployedToggle = ({
  candidateId,
  title,
  subtitle,
  modalTitle,
  modalConfirmation,
  notificationMessage,
  defaultValue,
  setData,
}: CandidateEmployedToggleProps) => {
  return (
    <ToggleWithConfirmationModal
      id="employedToggle"
      title={title}
      modalTitle={modalTitle}
      modalConfirmation={modalConfirmation}
      defaultValue={defaultValue}
      formSchema={formEditEmployed}
      subtitle={subtitle}
      onToggle={(employed, fields = {}) => {
        const contract = findConstantFromValue(fields.contract, CONTRACTS);
        const hasEnd = contract && contract.end;

        const mutatedFields = {
          ...fields,
          contract: employed ? fields.contract : null,
          endOfContract:
            fields.endOfContract && hasEnd ? fields.endOfContract : null,
        };

        return Api.putCandidate(candidateId, {
          employed,
          ...mutatedFields,
        })
          .then(() => {
            setData({
              employed,
              ...mutatedFields,
            });
            UIkit.notification(notificationMessage, 'success');
          })
          .catch(() => {
            return UIkit.notification('Une erreur est survenue', 'danger');
          });
      }}
    />
  );
};
