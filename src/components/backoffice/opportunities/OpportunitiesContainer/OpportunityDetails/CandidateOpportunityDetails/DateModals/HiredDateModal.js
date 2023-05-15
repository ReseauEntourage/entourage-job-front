import React from 'react';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import renderSimpleDatePickerField from 'src/components/forms/schema/formSimpleDatePicker';
import { Api } from 'src/api/index.ts';
import { EVENT_TYPES } from 'src/constants';
import UIkit from 'uikit';
import PropTypes from 'prop-types';
import moment from 'moment';

export const HiredDateModal = ({
  opportunityId,
  candidateId,
  contract,
  callback,
}) => {
  return (
    <ModalEdit
      title="Félicitation vous avez décroché un emploi"
      formSchema={renderSimpleDatePickerField("Date d'embauche*")}
      formId="update-to-hired-datepicker"
      submitText="Valider la date d'embauche"
      cancelText="Je n'ai pas encore de date d'embauche"
      defaultValues={{ datepicker: moment().format('YYYY-MM-DD') }}
      onSubmit={async ({ datepicker }, closeModal) => {
        try {
          await Api.postOpportunityUserEvent(opportunityId, candidateId, {
            type: EVENT_TYPES.HIRING,
            startDate: datepicker,
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

HiredDateModal.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  candidateId: PropTypes.string.isRequired,
  contract: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
