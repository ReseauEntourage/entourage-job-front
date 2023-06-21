import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, IconNoSSR } from 'src/components/utils';

export const ButtonPost = ({
  text,
  icon,
  action,
  style,
  disabled,
  dataTestId,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={disabled}
      style={style}
      dataTestId={dataTestId}
      onClick={() => {
        if (!loading) {
          setLoading(true);
          action()?.finally(() => {
            return setLoading(false);
          });
        }
      }}
    >
      <div className="uk-flex uk-flex-middle">
        {text}
        {loading ? (
          <div className="uk-margin-small-left" data-uk-spinner="ratio: .5" />
        ) : (
          icon && (
            <IconNoSSR
              className="uk-margin-small-left"
              name={icon}
              ratio={0.8}
            />
          )
        )}
      </div>
    </Button>
  );
};
ButtonPost.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func,
  style: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  dataTestId: PropTypes.string,
};

ButtonPost.defaultProps = {
  action: undefined,
  style: undefined,
  icon: undefined,
  disabled: false,
  dataTestId: '',
};
