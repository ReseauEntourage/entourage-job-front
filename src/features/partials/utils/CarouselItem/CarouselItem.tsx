import React from 'react';

import { Grid } from '@/src/components/ui';
import { addPrefix } from 'src/utils';

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
      <Grid
        childWidths={[`1-2@m`]}
        match
        center
        middle
        gap="collapse"
        className="uk-flex-wrap uk-flex-wrap-middle"
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
      </Grid>
    </li>
  );
};
