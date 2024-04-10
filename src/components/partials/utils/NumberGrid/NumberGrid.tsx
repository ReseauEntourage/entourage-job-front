import React from 'react';
import { Grid } from 'src/components/utils';
import { NumberCard } from './NumberCard';

interface NumberGridProps {
  numbers: {
    value: number | string;
    description: string;
    subDescription?: string;
    animate?: boolean;
  }[];
  numbersPerRow?: number;
}

export const NumberGrid = ({ numbers, numbersPerRow = 3 }: NumberGridProps) => {
  return (
    <div data-uk-height-match="target: .ent-number-description">
      <Grid
        center
        middle
        gap="small"
        childWidths={[`1-${numbersPerRow}@m`]}
        items={numbers.map(
          ({ value, description, subDescription, animate }) => {
            return (
              <div className="uk-flex uk-flex-center">
                <NumberCard
                  value={value}
                  description={description}
                  subDescription={subDescription}
                  animate={animate}
                />
              </div>
            );
          }
        )}
      />
    </div>
  );
};
