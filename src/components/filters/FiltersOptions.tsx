import React from 'react';
import { Button } from '../utils';
import { StyledFiltersOptions } from './FiltersOptions.styles';

export const FiltersOptions = ({
  resetFilters,
}: {
  resetFilters: () => void;
}) => {
  return (
    <StyledFiltersOptions className="uk-flex uk-flex-top uk-flex-right uk-flex-1">
      <div className="uk-flex uk-flex-middle uk-flex-right">
        <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
          <div className="uk-flex">
            <Button
              variant="default"
              size="small"
              dataTestId="reset-filters"
              onClick={resetFilters}
              className="reset-filters-button"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </div>
    </StyledFiltersOptions>
  );
};
