import React from 'react';
import { CVList } from 'src/components/partials/CV/CVList';
import { Text, ContainerWithTextCentered, Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { CV_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks/useFilters';
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
          <Text center>
            Découvrez ci-dessous les CV des candidats Entourage Pro. Vous pouvez
            leur donner un coup de pouce en partageant leur CV.
          </Text>
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
