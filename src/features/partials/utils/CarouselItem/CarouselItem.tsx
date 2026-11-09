import React from 'react';

import { addPrefix } from '@/src/utils';
import { StyledCarouselItemGrid } from './CarouselItem.styles';

interface CarouselItemProps {
  index: number;
  img: string;
  description: React.ReactNode;
}

export const CarouselItem = ({
  index,
  img,
  description,
}: CarouselItemProps) => {
  return (
    <li key={index.toString()}>
      <StyledCarouselItemGrid
        childWidths={[`1-2@m`]}
        match
        center
        middle
        gap="collapse"
      >
        <div
          className="uk-flex-1 uk-background-position-center-center uk-background-cover uk-height-large"
          style={{ backgroundImage: `url(${addPrefix(img)})` }}
        />
        <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle uk-padding-large">
          <div className="uk-flex uk-flex-center uk-flex-middle uk-height-medium ">
            {description}
          </div>
        </div>
      </StyledCarouselItemGrid>
    </li>
  );
};
