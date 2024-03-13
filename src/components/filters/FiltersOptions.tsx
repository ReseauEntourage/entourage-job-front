import React from 'react';
import { Button } from 'src/components/utils/Button';

export const FiltersOptions = ({
  resetFilters,
}: {
  resetFilters: () => void;
}) => {
  return (
    <div className="uk-flex uk-flex-top uk-flex-right uk-flex-1">
      <div className="uk-flex uk-flex-middle uk-flex-right">
        <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
          <div className="uk-flex">
            <Button
              style="custom-secondary"
              color="primaryBlue"
              size="small"
              dataTestId="reset-filters"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
