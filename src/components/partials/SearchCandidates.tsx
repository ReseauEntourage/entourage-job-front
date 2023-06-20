import React from 'react';
import { CVList } from 'src/components/cv';
import { Grid, Section } from 'src/components/utils';
import { CV_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks/useFilters';

const cvFiltersWithoutGender = CV_FILTERS_DATA.slice(0, -1);

export const SearchCandidates = ({ style }: { style?: string }) => {
  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    cvFiltersWithoutGender,
    '/candidats'
  );

  return (
    <Section style={style}>
      <Grid
        gap="medium"
        column
        middle
        center
        eachWidths={['2-3@s', '1-1', '1-1']}
      >
        <div className="uk-text-center">
          <h2 className="uk-text-bold">
            Découvrez les <span className="uk-text-primary">candidats</span>
          </h2>
          <div>
            Découvrez ci-dessous les CV des candidats LinkedOut disponibles, et
            envoyez votre offre au profil qui correspond à vos besoins de
            recrutement.
          </div>
        </div>
        <CVList
          search={search}
          filters={filters}
          resetFilters={resetFilters}
          setSearch={setSearch}
          setFilters={setFilters}
        />
      </Grid>
    </Section>
  );
};

SearchCandidates.defaultProps = {
  style: 'default',
};
