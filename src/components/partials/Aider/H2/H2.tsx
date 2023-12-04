import React from 'react';
import DoubleCarresIcon from 'assets/icons/double-carres.svg';
import { StyledTitleSection } from 'src/components/partials/Aider/H2/H2.styles';

interface TitleSectionProps {
  title: string;
  titleColor: string;
  svgStroke?: string;
  svgColor: string;
}

export const TitleSection = ({
  title,
  titleColor,
  svgStroke = 'white',
  svgColor,
}: TitleSectionProps) => {
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
