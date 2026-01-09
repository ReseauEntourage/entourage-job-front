import React from 'react';
import { Button } from '@/src/components/ui';
import { StyledFiltersOptions } from './FiltersOptions.styles';

export const FiltersOptions = ({
  resetFilters,
}: {
  resetFilters: () => void;
}) => {
  return (
    <StyledFiltersOptions>
      <Button
        variant="default"
        size="small"
        dataTestId="reset-filters"
        onClick={resetFilters}
        className="reset-filters-button"
      >
        Réinitialiser les filtres
      </Button>
    </StyledFiltersOptions>
  );
};
