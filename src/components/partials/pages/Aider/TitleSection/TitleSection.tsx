import React from 'react';
import DoubleCarresIcon from 'assets/icons/double-carres.svg';
import { H2 } from 'src/components/utils/Headings';
import { StyledTitleSection } from './TitleSection.styles';

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
        <H2 title={title} color={titleColor} />
      </div>
      <DoubleCarresIcon />
    </StyledTitleSection>
  );
};
