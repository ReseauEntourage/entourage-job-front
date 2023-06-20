import PropTypes from 'prop-types';
import React from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import schemaEditEmployed from 'src/components/forms/schema/formEditEmployed';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';

const CandidateEmployedToggle = ({
  candidateId,
  title,
  subtitle,
  modalTitle,
  modalConfirmation,
  notificationMessage,
  defaultValue,
  setData,
}) => {
  return (
    <ToggleWithConfirmationModal
      id="employedToggle"
      title={title}
      modalTitle={modalTitle}
      modalConfirmation={modalConfirmation}
      defaultValue={defaultValue}
      formSchema={schemaEditEmployed}
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

CandidateEmployedToggle.propTypes = {
  candidateId: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  modalTitle: PropTypes.string.isRequired,
  modalConfirmation: PropTypes.string.isRequired,
  notificationMessage: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
};

CandidateEmployedToggle.defaultProps = {
  subtitle: undefined,
  title: undefined,
};

export default CandidateEmployedToggle;
