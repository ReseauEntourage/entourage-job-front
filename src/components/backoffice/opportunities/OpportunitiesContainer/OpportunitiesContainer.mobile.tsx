import React from 'react';
import {
  StyledContainer,
  StyledDetailsContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { BackLink } from 'src/components/utils/BackLink';
import { OpportunitiesContainerProps } from './OpportunitiesContainer.types';
import { OpportunitiesList } from './OpportunitiesList';

export const OpportunitiesContainerMobile = ({
  list,
  details,
  isLoading,
  backButtonHref,
  noContent,
}: OpportunitiesContainerProps) => {
  const opportunityId = useOpportunityId();

  return (
    <StyledContainer>
      {list ? (
        <>
          {opportunityId ? (
            <StyledDetailsContainer>
              <BackLink
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                url={backButtonHref}
                label="Retour à la liste"
              />
              {details}
            </StyledDetailsContainer>
          ) : (
            <OpportunitiesList isLoading={isLoading} list={list} />
          )}
        </>
      ) : (
        noContent
      )}
    </StyledContainer>
  );
};
