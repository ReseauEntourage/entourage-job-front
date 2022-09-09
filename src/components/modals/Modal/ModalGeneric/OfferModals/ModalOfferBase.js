import ModalGeneric from 'src/components/modals/Modal/ModalGeneric';
import React from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const ModalOfferBase = ({
  isArchived,
  isExternal,
  children,
  navigateBackToList,
  editingForm,
  loading,
  isEditing,
  setIsEditing,
}) => {
  let className = '';
  if (isArchived) {
    className += 'uk-light uk-background-secondary';
  } else if (isExternal) {
    className += 'uk-background-muted';
  }

  return (
    <ModalGeneric
      fullWidth
      className={className}
      onClose={(closeModal) => {
        if (isEditing) {
          setIsEditing(false);
        } else {
          closeModal();
          navigateBackToList();
        }
      }}
    >
      {loading && <LoadingScreen />}
      {!loading && (isEditing ? editingForm : children)}
    </ModalGeneric>
  );
};

ModalOfferBase.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.bool])
    ),
  ]).isRequired,
  navigateBackToList: PropTypes.func.isRequired,
  editingForm: PropTypes.element.isRequired,
  loading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

export default ModalOfferBase;
