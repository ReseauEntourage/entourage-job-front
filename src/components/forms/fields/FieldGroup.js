import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';

const FieldGroup = ({ title, fields, childWidths }) => {
  return (
    <div>
      {title ? (
        <p
          className="uk-form-label"
          style={{
            paddingLeft: '0px',
            color: '#f66b28',
            opacity: '.8',
            fontSize: '0.8rem',
            transform: 'translateY(-26px)',
            transition: '0.8s',
          }}
        >
          {title}
        </p>
      ) : null}
      <Grid
        className="uk-visible@m"
        eachWidths={childWidths}
        childWidths={!childWidths ? [`1-${fields.length}`] : undefined}
        middle
        gap="small"
        items={fields}
      />
      <Grid
        className="uk-hidden@m"
        eachWidths={childWidths}
        childWidths={!childWidths ? [`1-${fields.length}`] : undefined}
        middle
        gap="collapse"
        items={fields}
      />
    </div>
  );
};

FieldGroup.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
  childWidths: PropTypes.arrayOf(PropTypes.string),
};

FieldGroup.defaultProps = {
  title: undefined,
  childWidths: undefined,
};

export default FieldGroup;
