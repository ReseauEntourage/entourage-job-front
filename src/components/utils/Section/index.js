import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_SECTION_SIZES, UIKIT_STYLES } from 'src/components/variables';
import { StyledSection } from 'src/components/utils/Section/styles';

const Section = ({
  style,
  size,
  id,
  container,
  children,
  className,
  preserveColor,
}) => {
  let custom = 0;
  let classBuffer = 'uk-section';
  let classBuffer2 = 'uk-container';
  if (className?.includes('custom')) {
    custom = 1;
  } else {
    if (style) classBuffer += ` uk-section-${style}`;
    if (size) classBuffer += ` uk-section-${size}`;
    if (className) classBuffer += ` ${className}`;
    if (preserveColor) classBuffer += ` uk-preserve-color`;

    if (container) classBuffer2 += ` uk-container-${container}`;
  }

  return custom ? (
    <StyledSection className={className}>
      <div className="section-container">{children}</div>
    </StyledSection>
  ) : (
    <div className={classBuffer} id={id}>
      <div className={classBuffer2}>{children}</div>
    </div>
  );
};
Section.propTypes = {
  style: PropTypes.oneOf(UIKIT_STYLES),
  size: PropTypes.oneOf(UIKIT_SECTION_SIZES),
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  container: PropTypes.oneOf(['small', 'large']),
  className: PropTypes.string,
  preserveColor: PropTypes.bool,
};
Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
  container: undefined,
  className: undefined,
  preserveColor: false,
};

export default Section;
