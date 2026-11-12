import React from 'react';

import { addPrefix } from '@/src/utils';
import {
  StyledCarouselItemGrid,
  StyledCarouselItemPicture,
  StyledCarouselItemText,
  StyledCarouselItemTextCell,
} from './CarouselItem.styles';

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
    <div key={index.toString()}>
      <StyledCarouselItemGrid
        childWidths={[`1-2@m`]}
        match
        center
        middle
        gap="collapse"
      >
        <StyledCarouselItemPicture
          style={{ backgroundImage: `url(${addPrefix(img)})` }}
        />
        <StyledCarouselItemTextCell>
          <StyledCarouselItemText>{description}</StyledCarouselItemText>
        </StyledCarouselItemTextCell>
      </StyledCarouselItemGrid>
    </div>
  );
};
