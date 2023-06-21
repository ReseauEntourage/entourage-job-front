import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { renderSimpleDatePickerField } from 'src/components/forms/schema/formSimpleDatePicker';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { EVENT_TYPES } from 'src/constants';

export const InterviewDateModel = ({
  opportunityId,
  candidateId,
  contract,
  callback,
}) => {
  return (
    <ModalEdit
      title="Félicitation vous avez décroché un entretien"
      formSchema={renderSimpleDatePickerField("Date d'entretien*")}
      formId="update-to-hired-datepicker"
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

InterviewDateModel.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  candidateId: PropTypes.string.isRequired,
  contract: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};
