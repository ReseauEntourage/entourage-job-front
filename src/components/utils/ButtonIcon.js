import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon.tsx';

const ButtonIcon = ({
  name,
  onClick,
  className,
  href,
  ratio,
  tooltip,
  style,
  dataTestId,
}) => {
  return (
    <a
      className="uk-text-emphasis uk-flex uk-flex-middle"
      href={href}
      data-uk-tooltip={tooltip}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <IconNoSSR
        name={name}
        className={className}
        ratio={ratio}
        style={style}
      />
    </a>
  );
};

ButtonIcon.propTypes = {
  name: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  ratio: PropTypes.number,
  style: PropTypes.shape({}),
  dataTestId: PropTypes.string,
};

ButtonIcon.defaultProps = {
  href: undefined,
  tooltip: undefined,
  className: undefined,
  style: {},
  ratio: 1.5,
  onClick: () => {},
  dataTestId: '',
};

export default ButtonIcon;
