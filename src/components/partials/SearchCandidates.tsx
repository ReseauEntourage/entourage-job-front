import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { PostPublicOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { Button, Grid, Section } from 'src/components/utils';
import { UIKIT_STYLES } from 'src/components/variables';
import { CV_FILTERS_DATA } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useFilters } from 'src/hooks/useFilters';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { CVList } from './CV/CVList';

const cvFiltersWithoutGender = CV_FILTERS_DATA.slice(0, -1);

export const SearchCandidates = ({ style }: { style?: UIKIT_STYLES }) => {
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
            Découvrez ci-dessous les CV des candidats Entourage Pro. Vous pouvez
            leur donner un coup de pouce en partageant leur CV, leur transmettre
            des opportunités, ou leur proposer des offres d&apos;emploi.
          </div>
          <p>
            <Button
              style="custom-text"
              color="darkGrayFont"
              dataTestId="search-candidates-post-opportunity-button"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_GALERIE_CV_PROPOSER_OFFRE_CLIC);
                fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_OPEN);
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                openModal(<PostPublicOpportunityModal />);
              }}
            >
              Vous êtes recruteur&nbsp;? Vous pouvez également publier une offre
              d&apos;emploi qui sera visible par tous les candidats Entourage
              Pro.
            </Button>
          </p>
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
