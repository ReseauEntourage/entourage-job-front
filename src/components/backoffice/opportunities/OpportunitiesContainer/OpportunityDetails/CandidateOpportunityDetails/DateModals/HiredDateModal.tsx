import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { renderSimpleDatePickerField } from 'src/components/forms/schemas/formSimpleDatePicker';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, EVENT_TYPES } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';

interface HiredDateModalProps {
  opportunityId: string;
  candidateId: string;
  contract: Contract;
  callback: () => void;
}

export const HiredDateModal = ({
  opportunityId,
  candidateId,
  contract,
  callback,
}: HiredDateModalProps) => {
  const dispatch = useDispatch();
  return (
    <ModalEdit
      title="Félicitation vous avez décroché un emploi"
      formSchema={renderSimpleDatePickerField<{ hiredDate: string }>(
        'update-to-hired',
        "Date d'embauche*",
        'hiredDate'
      )}
      submitText="Valider la date d'embauche"
      cancelText="Je n'ai pas encore de date d'embauche"
      defaultValues={{ hiredDate: moment().format('YYYY-MM-DD') }}
      onSubmit={async ({ hiredDate }, closeModal) => {
        try {
          await Api.postOpportunityUserEvent(opportunityId, candidateId, {
            type: EVENT_TYPES.HIRING,
            startDate: hiredDate,
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
