import PropTypes from 'prop-types';
import React from 'react';
import DoubleCarresIcon from 'assets/icons/double-carres.svg';
import { H2 } from 'src/components/utils/Headings';
import { StyledTitleSection } from './TitleSection.styles';

export const TitleSection = ({ title, titleColor, svgStroke, svgColor }) => {
  return (
    <StyledTitleSection
      titleColor={titleColor}
      svgStroke={svgStroke}
      svgColor={svgColor}
    >
      <DoubleCarresIcon />
      <div className="title">
        <H2 title={title} color={titleColor} />
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
