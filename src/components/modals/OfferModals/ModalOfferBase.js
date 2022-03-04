import ModalGeneric from 'src/components/modals/ModalGeneric';
import React from 'react';
import PropTypes from 'prop-types';

const ModalOfferBase = ({
  isArchived,
  isExternal,
  children,
  navigateBackToList,
  editingForm,
  error,
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
      {loading && (
        <div className="uk-height-medium uk-flex uk-flex-middle uk-flex-center">
          <div data-uk-spinner="" />
        </div>
      )}
      {!loading && error && <div>Une erreur c&lsquo;est produite</div>}
      {!loading && !error && (isEditing ? editingForm : children)}
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
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

export default ModalOfferBase;
