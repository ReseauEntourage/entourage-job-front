import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { IlluMalette } from 'assets/icons/icons';
import { useContextualRole } from '../../useContextualRole';
import { Button, Card, Tag } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { WarningStrip } from 'src/components/utils/WarningStrip';
import { BUSINESS_LINES } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import {
  selectCandidateId,
  selectCandidateProfileDefaultFiltersForDashboardOpportunities,
  selectCandidateAsUser,
} from 'src/use-cases/current-user';
import { findConstantFromValue, buildContractLabel } from 'src/utils';
import {
  StyledDashboardOpportunitiesEmptyState,
  StyledDashboardOpportunitiesListContainer,
  StyledDashboardOpportunityItem,
  StyledDashboardOpportunityItemBLs,
  StyledDashboardOpportunityItemTitle,
  StyledDashboardOpportunitySubInfos,
  StyledDashboardOpprtunityCTAOrSpinnerContainer,
  StyledDashbordOpportunitiesInProgress,
} from './DashboardOpportunitiesCard.styles';
import { useDashboardOpportunities } from './useDashboardOpportunities';

const uuidValue = uuid();

export const DashboardOpportunitiesCard = () => {
  const user = useAuthenticatedUser();
  const { isDataLoading, opportunities, numberOpportunitiesInProgess } =
    useDashboardOpportunities();
  const { contextualRole } = useContextualRole(user.role);
  const isDesktop = useIsDesktop();
  const candidate = useSelector(selectCandidateAsUser);
  const candidateId = useSelector(selectCandidateId);
  const opportunitiesDefaultFilters = useSelector(
    selectCandidateProfileDefaultFiltersForDashboardOpportunities
  );
  return (
    <Card
      title={
        contextualRole === USER_ROLES.COACH
          ? `Les offres qui pourraient intéresser ${candidate?.firstName}`
          : `Les offres qui pourraient vous intéresser`
      }
    >
      {!isDataLoading ? (
        <>
          {!!numberOpportunitiesInProgess &&
            numberOpportunitiesInProgess > 0 && (
              <WarningStrip>
                <StyledDashbordOpportunitiesInProgress>
                  <div>
                    <IlluMalette height="39" width="39" />
                    {contextualRole === USER_ROLES.COACH
                      ? `${candidate?.firstName} a`
                      : `Vous avez`}
                    <strong>
                      {' '}
                      {numberOpportunitiesInProgess} opportunité
                      {numberOpportunitiesInProgess > 0 && 's'} à traiter.
                    </strong>
                  </div>
                  {isDesktop && (
                    <Button
                      style="custom-secondary"
                      size="small"
                      href={`/backoffice/candidat/${candidateId}/offres/private?status=-1`}
                    >
                      Traiter les offres
                    </Button>
                  )}
                </StyledDashbordOpportunitiesInProgress>
              </WarningStrip>
            )}
          {opportunities && !isDataLoading && (
            <>
              {!!numberOpportunitiesInProgess &&
                numberOpportunitiesInProgess > 0 && (
                  <H6
                    title={
                      contextualRole === USER_ROLES.COACH
                        ? `D'autres offres qui pourraient intéresser ${candidate?.firstName}`
                        : `D'autres offres qui pourraient vous intéresser`
                    }
                  />
                )}
              {!isDataLoading && opportunities && opportunities.length > 0 && (
                <StyledDashboardOpportunitiesListContainer>
                  {opportunities.map((opportunity, i) => {
                    return (
                      <Link
                        href={{
                          pathname: `/backoffice/candidat/${candidateId}/offres/public/${opportunity.id}`,
                          query: opportunitiesDefaultFilters,
                        }}
                        key={`opp-${uuidValue}-${i}`}
                      >
                        <StyledDashboardOpportunityItem
                          className={isDesktop ? '' : 'mobile'}
                        >
                          <StyledDashboardOpportunityItemTitle
                            className={isDesktop ? '' : 'mobile'}
                          >
                            {opportunity.title.toUpperCase()}
                          </StyledDashboardOpportunityItemTitle>
                          <StyledDashboardOpportunityItemBLs>
                            {opportunity.businessLines.map(
                              (businessLine, k) => {
                                return (
                                  <Tag
                                    key={`tag-${uuidValue}-${k}`}
                                    content={
                                      findConstantFromValue(
                                        businessLine.name,
                                        BUSINESS_LINES
                                      ).label
                                    }
                                  />
                                );
                              }
                            )}
                          </StyledDashboardOpportunityItemBLs>
                          <StyledDashboardOpportunitySubInfos>
                            {buildContractLabel(
                              opportunity.contract,
                              opportunity.endOfContract,
                              opportunity.startOfContract
                            )}{' '}
                            - {opportunity.department}
                          </StyledDashboardOpportunitySubInfos>
                        </StyledDashboardOpportunityItem>
                      </Link>
                    );
                  })}
                </StyledDashboardOpportunitiesListContainer>
              )}
              {!isDataLoading &&
                opportunities &&
                opportunities.length === 0 && (
                  <StyledDashboardOpportunitiesEmptyState>
                    <IlluMalette height="39" width="39" />
                    Aucune offre ne corresond à votre recherche.
                  </StyledDashboardOpportunitiesEmptyState>
                )}
            </>
          )}

          <StyledDashboardOpprtunityCTAOrSpinnerContainer>
            <Button
              style="custom-secondary-inverted"
              href={{
                pathname: `/backoffice/candidat/${candidateId}/offres/public`,
                query: opportunitiesDefaultFilters,
              }}
            >
              Voir toutes les offres
            </Button>
          </StyledDashboardOpprtunityCTAOrSpinnerContainer>
        </>
      ) : (
        <StyledDashboardOpprtunityCTAOrSpinnerContainer>
          <Spinner />
        </StyledDashboardOpprtunityCTAOrSpinnerContainer>
      )}
    </Card>
  );
};
