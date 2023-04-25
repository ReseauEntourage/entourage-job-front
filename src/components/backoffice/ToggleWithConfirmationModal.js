import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'src/components/utils';
import ModalGeneric from 'src/components/modals/Modal/ModalGeneric';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { openModal, useModalContext } from 'src/components/modals/Modal';

const ModalToggle = ({
  modalTitle,
  modalDescription,
  onToggle,
  setToggle,
  modalConfirmation,
  id,
}) => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric title={modalTitle} description={modalDescription}>
      <Grid className="uk-grid-small uk-flex-center uk-margin-large-top">
        <Button style="default" onClick={onClose}>
          Annuler
        </Button>
        <Button
          style="primary"
          dataTestId={`test-confirm-${id}`}
          onClick={() => {
            onToggle(true).then(() => {
              return setToggle(true);
            });
            onClose();
          }}
        >
          {modalConfirmation}
        </Button>
      </Grid>
    </ModalGeneric>
  );
};

ModalToggle.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  modalDescription: PropTypes.element,
  modalConfirmation: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  setToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

ModalToggle.defaultProps = {
  modalDescription: undefined,
  modalConfirmation: 'Oui',
};

const ToggleWithConfirmationModal = ({
  id,
  title,
  subtitle,
  modalTitle,
  modalDescription,
  modalConfirmation,
  defaultValue,
  onToggle,
  formSchema,
}) => {
  const [toggle, setToggle] = useState(defaultValue);
  useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <div className="uk-form-controls">
        <div className="uk-flex uk-flex-middle">
          <div className="ent-toggle">
            <label htmlFor={`ent-toggle-${id}`}>
              <input
                id={`ent-toggle-${id}`}
                data-testId={`test-toggle-${id}`}
                type="checkbox"
                checked={toggle}
                onChange={() => {
                  if (toggle) {
                    onToggle(false).then(() => {
                      return setToggle(false);
                    });
                  } else if (formSchema) {
                    openModal(
                      <ModalEdit
                        title={modalTitle}
                        description={modalDescription}
                        formSchema={formSchema}
                        submitText={modalConfirmation}
                        // id={id}
                        onSubmit={async (fields, closeModal) => {
                          await onToggle(true, fields);
                          setToggle(true);
                          closeModal();
                        }}
                      />
                    );
                  } else {
                    openModal(
                      <ModalToggle
                        modalTitle={modalTitle}
                        id={id}
                        modalDescription={modalDescription}
                        modalConfirmation={modalConfirmation}
                        onToggle={onToggle}
                        setToggle={setToggle}
                      />
                    );
                  }
                }}
              />
              <span className="ent-slider round" />
            </label>
          </div>
          {(title || subtitle) && (
            <div className="uk-flex uk-flex-column uk-margin-small-left">
              {title && <span>{title}</span>}
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ToggleWithConfirmationModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  modalTitle: PropTypes.string.isRequired,
  modalDescription: PropTypes.element,
  modalConfirmation: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    rules: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

ToggleWithConfirmationModal.defaultProps = {
  defaultValue: undefined,
  subtitle: undefined,
  title: undefined,
  modalDescription: undefined,
  modalConfirmation: 'Oui',
  formSchema: undefined,
};

export default ToggleWithConfirmationModal;
