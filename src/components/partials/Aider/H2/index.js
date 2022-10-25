import React from 'react';
import { StyledTitleSection } from 'src/components/partials/Aider/H2/styles';
import DoubleCarresIcon from 'public/static/img/icons/double-carres.svg';
import { string, PropTypes } from 'prop-types';

const TitleSection = ({ title, titleColor, svgStroke, svgColor }) => {
  return (
    <StyledTitleSection
      titleColor={titleColor}
      svgStroke={svgStroke}
      svgColor={svgColor}
    >
      <DoubleCarresIcon />
      <div className="title">
        <h2>{title}</h2>
      </div>
      <DoubleCarresIcon />
    </StyledTitleSection>
  );
};

TitleSection.propTypes = {
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string.isRequired,
  svgStroke: PropTypes.string,
  svgColor: PropTypes.string.isRequired,
};

TitleSection.defaultProps = {
  svgStroke: 'white',
};

export default TitleSection;