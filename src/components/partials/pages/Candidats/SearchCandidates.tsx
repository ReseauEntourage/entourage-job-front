import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { PostPublicOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { CVList } from 'src/components/partials/CV/CVList';
import {
  Button,
  ContainerWithTextCentered,
  Section,
} from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { CV_FILTERS_DATA } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useFilters } from 'src/hooks/useFilters';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { StyledCandidatsHeaderContainer } from './Candidats.styles';

const cvFiltersWithoutGender = CV_FILTERS_DATA.slice(0, -1);

export const SearchCandidates = () => {
  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    cvFiltersWithoutGender,
    '/candidats'
  );

  return (
    <Section className="custom-header">
      <ContainerWithTextCentered>
        <StyledCandidatsHeaderContainer>
          <H1 center title="Découvrez les candidats" />
          <div>
            Découvrez ci-dessous les CV des candidats Entourage Pro. Vous pouvez
            leur donner un coup de pouce en partageant leur CV, leur transmettre
            des opportunités, ou leur proposer des offres d&apos;emploi.
          </div>
          <p>
            <Button
              style="custom-text"
              color="darkGray"
              dataTestId="search-candidates-post-opportunity-button"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_GALERIE_CV_PROPOSER_OFFRE_CLIC);
                fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_OPEN);
                openModal(<PostPublicOpportunityModal />);
              }}
            >
              Vous êtes recruteur&nbsp;? Vous pouvez également publier une offre
              d&apos;emploi qui sera visible par tous les candidats Entourage
              Pro.
            </Button>
          </p>
        </StyledCandidatsHeaderContainer>
      </ContainerWithTextCentered>
      <CVList
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
      />
    </Section>
  );
};
