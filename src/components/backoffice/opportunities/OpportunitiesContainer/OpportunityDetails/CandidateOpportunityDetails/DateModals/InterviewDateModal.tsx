import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { renderSimpleDatePickerField } from 'src/components/forms/schemas/formSimpleDatePicker';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, EVENT_TYPES } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';

interface InterviewDateModalProps {
  opportunityId: string;
  candidateId: string;
  contract: Contract;
  callback: () => void;
}

export const InterviewDateModel = ({
  opportunityId,
  candidateId,
  contract,
  callback,
}: InterviewDateModalProps) => {
  const dispatch = useDispatch();
  return (
    <ModalEdit
      title="Félicitation vous avez décroché un entretien"
      formSchema={renderSimpleDatePickerField<{ interviewDate: string }>(
        'update-to-hired',
        "Date d'entretien*",
        'interviewDate'
      )}
      submitText="Valider la date d'entretien"
      cancelText="Je n’ai pas encore de date d'entretien"
      defaultValues={{ interviewDate: moment().format('YYYY-MM-DD') }}
      onSubmit={async ({ interviewDate }, closeModal) => {
        try {
          await Api.postOpportunityUserEvent(opportunityId, candidateId, {
            type: EVENT_TYPES.INTERVIEW,
            startDate: interviewDate,
            endDate: interviewDate,
            contract: { name: contract },
          });
          closeModal();
          callback();
        } catch (e) {
          console.error(e);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: "Une erreur s'est produite",
            })
          );
        }
      }}
    />
  );
};
