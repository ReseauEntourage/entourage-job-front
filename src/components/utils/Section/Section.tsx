import PropTypes from 'prop-types';
import React from 'react';
import { StyledSection } from 'src/components/utils/Section/Section.styles';
import { UIKIT_SECTION_SIZES, UIKIT_STYLES } from 'src/components/variables';

export const Section = ({
  style,
  size,
  id,
  container,
  children,
  className,
  preserveColor,
  display,
}) => {
  let custom = false;
  let classBuffer = 'uk-section';
  let classBuffer2 = 'uk-container';
  if (className?.includes('custom')) {
    custom = true;
  } else {
    if (style) classBuffer += ` uk-section-${style}`;
    if (size) classBuffer += ` uk-section-${size}`;
    if (className) classBuffer += ` ${className}`;
    if (preserveColor) classBuffer += ` uk-preserve-color`;

    if (container) classBuffer2 += ` uk-container-${container}`;
  }

  return custom ? (
    <StyledSection className={className}>
      <div className={`${display} section-container`}>{children}</div>
    </StyledSection>
  ) : (
    <div className={classBuffer} id={id}>
      <div className={classBuffer2}>{children}</div>
    </div>
  );
};
Section.propTypes = {
  style: PropTypes.oneOf([
    ...UIKIT_STYLES,
    'custom-header',
    'custom-primary',
    'custom-mobile-darkBG',
    'custom-fixed',
  ]),
  size: PropTypes.oneOf(UIKIT_SECTION_SIZES),
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  container: PropTypes.oneOf(['small', 'large']),
  className: PropTypes.string,
  preserveColor: PropTypes.bool,
  display: PropTypes.string,
};
Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
  container: undefined,
  className: undefined,
  preserveColor: false,
  display: '',
};
