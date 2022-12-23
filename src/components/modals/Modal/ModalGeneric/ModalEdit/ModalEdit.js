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
  onError,
  formId,
}) => {
  const { onClose } = useModalContext();
  console.log(description);

  return (
    <ModalGeneric title={title} description={description}>
      <FormWithValidation
        submitText={submitText}
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
    fields: PropTypes.arrayOf(PropTypes.object),
    rules: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func,
  defaultValues: PropTypes.objectOf(PropTypes.any),
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  submitText: PropTypes.string,
  formId: PropTypes.string,
};
ModalEdit.defaultProps = {
  defaultValues: {},
  description: undefined,
  submitText: 'Sauvegarder',
  formId: '',
  onError: () => {},
};

export default ModalEdit;
