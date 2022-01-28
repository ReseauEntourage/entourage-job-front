import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { UIKIT_SCREENS } from 'src/components/variables';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import UIkit from 'uikit';

const Hamburger = ({ hidden, targetId, visible, light }) => {
  let classBuffer = '';
  if (hidden) classBuffer += `uk-hidden@${hidden}`;
  if (visible) classBuffer += `uk-visible@${visible}`;
  return (
    <ButtonIcon
      style={
        light
          ? {
              color: 'inherit !important',
            }
          : { color: 'white' }
      }
      className={classBuffer}
      onClick={() => {
        UIkit.offcanvas(`#${targetId}`).show();
      }}
      name="menu"
    />
  );
};

Hamburger.propTypes = {
  hidden: PropTypes.oneOf(UIKIT_SCREENS),
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  light: PropTypes.bool,
  targetId: PropTypes.string.isRequired,
};

Hamburger.defaultProps = {
  hidden: undefined,
  visible: undefined,
  light: false,
};

export const HamburgerNoSSR = dynamic(
  () => {
    return import('src/components/utils/Hamburger');
  },
  {
    ssr: false,
  }
);

export default Hamburger;
