import React from 'react';
import PropTypes from 'prop-types';

import ModalGeneric from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';
import { useModalContext } from 'src/components/modals/Modal';

const ModalConfirm = ({ onConfirm, text, title, buttonText, children }) => {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric description={text} title={title}>
      {children && <div className="uk-margin-medium-bottom">{children}</div>}
      <div className="uk-modal-footer uk-padding-remove-bottom">
        <Button style="default" onClick={onClose}>
          Annuler
        </Button>
        <Button
          style="primary"
          onClick={() => {
            onClose();
            onConfirm();
          }}
        >
          {buttonText}
        </Button>
      </div>
    </ModalGeneric>
  );
};
ModalConfirm.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  buttonText: PropTypes.string.isRequired,
};

ModalConfirm.defaultProps = {
  title: undefined,
  children: undefined,
};

export default ModalConfirm;
