import Link from 'next/link';
import React from 'react';
import {
  StyledBackLink,
  StyledContainer,
  StyledDetailsContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { IconNoSSR } from 'src/components/utils';
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
              <Link href={backButtonHref} scroll={false} shallow passHref>
                <StyledBackLink>
                  <IconNoSSR name="chevron-left" />
                  Retour à la liste
                </StyledBackLink>
              </Link>
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
