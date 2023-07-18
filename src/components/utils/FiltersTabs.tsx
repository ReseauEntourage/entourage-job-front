import React from 'react';
import { Grid } from 'src/components/utils/Grid';

interface FiltersTabsProps {
  setTabFilters: (arg1: string) => void;
  tabFilters?: {
    title?: string;
    tag?: string;
    active?: boolean;
  }[];
}

export const FiltersTabs = ({
  tabFilters,
  setTabFilters,
}: FiltersTabsProps) => {
  return (
    <div>
      <Grid eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {tabFilters.map(({ title, tag, active }, i) => {
            return (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    return setTabFilters(tag);
                  }}
                >
                  {title}
                </a>
              </li>
            );
          })}
        </ul>
      </Grid>
    </div>
  );
};

FiltersTabs.defaultProps = {
  tabFilters: [],
};
