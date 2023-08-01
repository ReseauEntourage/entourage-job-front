import moment from 'moment';
import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { renderSimpleDatePickerField } from 'src/components/forms/schemas/formSimpleDatePicker';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, EVENT_TYPES } from 'src/constants';

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
  return (
    <ModalEdit
      title="Félicitation vous avez décroché un entretien"
      formSchema={renderSimpleDatePickerField(
        'update-to-hired-datepicker',
        "Date d'entretien*"
      )}
      submitText="Valider la date d'entretien"
      cancelText="Je n’ai pas encore de date d'entretien"
      defaultValues={{ datepicker: moment().format('YYYY-MM-DD') }}
      onSubmit={async ({ datepicker }, closeModal) => {
        try {
          await Api.postOpportunityUserEvent(opportunityId, candidateId, {
            type: EVENT_TYPES.INTERVIEW,
            startDate: datepicker,
            endDate: datepicker,
            contract: { name: contract },
          });
          closeModal();
          callback();
        } catch (e) {
          UIkit.notification("Une erreur s'est produite", 'danger');
        }
      }}
    />
  );
};
