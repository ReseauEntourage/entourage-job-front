import React from 'react';

import PropTypes from 'prop-types';
import ModalGeneric from 'src/components/modals/Modal/ModalGeneric';
import FormWithValidation from 'src/components/forms/FormWithValidation';

import { useModalContext } from 'src/components/modals/Modal';

const ModalEdit = ({
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
  submitText,
  cancelText,
  onError,
  formId,
}) => {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric title={title} description={description}>
      <FormWithValidation
        submitText={submitText}
        cancelText={cancelText}
        formSchema={formSchema}
        defaultValues={defaultValues}
        onCancel={onClose}
        onError={onError}
        formId={formId}
        onSubmit={(fields, setError) => {
          return onSubmit(fields, onClose, setError);
        }}
      />
    </ModalGeneric>
  );
};

ModalEdit.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    rules: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func,
  defaultValues: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({})),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({}),
      PropTypes.string,
    ])
  ),
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  formId: PropTypes.string,
};
ModalEdit.defaultProps = {
  defaultValues: {},
  description: undefined,
  submitText: 'Sauvegarder',
  cancelText: 'Annuler',
  formId: '',
  onError: () => {},
};

export default ModalEdit;
