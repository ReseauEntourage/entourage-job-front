import React from 'react';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import renderSimpleDatePickerField from 'src/components/forms/schema/formSimpleDatePicker';
import Api from 'src/api/index.ts';
import { EVENT_TYPES } from 'src/constants';
import UIkit from 'uikit';
import { PropTypes } from 'prop-types';

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
      cancelText="Je n’ai pas encore de date d\'entretien"
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
