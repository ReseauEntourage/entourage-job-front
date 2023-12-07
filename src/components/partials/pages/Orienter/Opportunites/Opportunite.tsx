import React from 'react';
import { Img } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledOrienterOpportunitesItem } from './Opportunites.styles';

interface OpportuniteProps {
  title: string;
  paragraph: string;
  src: string;
}

export const Opportunite = ({ title, paragraph, src }: OpportuniteProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledOrienterOpportunitesItem className={isDesktop ? '' : 'mobile'}>
      <div className="image-container">
        <Img src={src} alt={title} cover />
      </div>
      <div className="text-container">
        <H6 title={title} color="black" center />
      </div>
      <p>{paragraph}</p>
    </StyledOrienterOpportunitesItem>
  );
};
