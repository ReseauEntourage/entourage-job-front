import React from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const OpportunityDetailsBase = ({
  isArchived,
  isExternal,
  children,
  editingForm,
  loading,
  isEditing,
}) => {
  let className = '';
  if (isArchived) {
    className += 'uk-light uk-background-secondary';
  } else if (isExternal) {
    className += 'uk-background-muted';
  }

  return (
    <div className={className}>
      {loading && <LoadingScreen />}
      {!loading && (isEditing ? editingForm : children)}
    </div>
  );
};

OpportunityDetailsBase.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.bool])
    ),
  ]).isRequired,
  editingForm: PropTypes.element.isRequired,
  loading: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default OpportunityDetailsBase;
