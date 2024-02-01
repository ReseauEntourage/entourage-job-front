import Link from 'next/link';
import React from 'react'
import { Button, Card, Tag } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { BUSINESS_LINES } from 'src/constants';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { findConstantFromValue } from 'src/utils';
import { StyledCardNotificationContainer } from '../../Backoffice.styles';
import { StyledDashboardOpportunitiesListContainer, StyledDashboardOpportunityItem, StyledDashboardOpportunityItemBLs, StyledDashboardOpportunityItemTitle, StyledDashboardOpprtunityCTAOrSpinnerContainer, StyledDashbordOpportunitiesInProgress } from './DashboardOpportunitiesCard.styles';
import { useDashboardOpportunities } from './useDashboardOpportunities'
import { v4 as uuid } from 'uuid';

const uuidValue = uuid();

export const DashboardOpportunitiesCard = () => {
    const user = useAuthenticatedUser();
    const { isDataLoading, numberOpportunitiesInProgess, opportunities, opportunitiesDefaultFilters, candidateId } = useDashboardOpportunities(user);
    return (
    <Card
        title="Les offres qui pourraient vous intéresser"
    >
                {!isDataLoading ?
                <>
                    {numberOpportunitiesInProgess && 
                        <StyledCardNotificationContainer>
                            <StyledDashbordOpportunitiesInProgress>
                                <div>
                                    Vous avez {numberOpportunitiesInProgess} opportunité{numberOpportunitiesInProgess > 0 && "s"} à traiter.
                                </div>
                                <Button
                                    style="custom-secondary"
                                    size='small'
                                    href={`/backoffice/candidat/${candidateId}/offres/private?status=-1`}
                                >
                                    Traiter les offres
                                </Button>
                            </StyledDashbordOpportunitiesInProgress>
                        </StyledCardNotificationContainer>
                    }
                    {opportunities && opportunities.length > 0 &&
                        <>  
                            <H6 title="D'autres offres qui pourraient vous intéresser" />
                            <StyledDashboardOpportunitiesListContainer>
                                {opportunities.map((opportunity) => {
                                    return (
                                        <Link
                                            href={{
                                                pathname: `/backoffice/candidat/${candidateId}/offres/public/${opportunity.id}`,
                                                query: opportunitiesDefaultFilters
                                            }}
                                            key={uuidValue}
                                        >
                                            <StyledDashboardOpportunityItem>
                                                <StyledDashboardOpportunityItemTitle>
                                                {opportunity.title.toUpperCase()}
                                                </StyledDashboardOpportunityItemTitle>
                                                <StyledDashboardOpportunityItemBLs>
                                                    {
                                                        opportunity.businessLines.map((businessLine) => {
                                                            return (
                                                                <Tag key={uuidValue} content={findConstantFromValue(businessLine.name, BUSINESS_LINES).label} />
                                                            )
                                                        })
                                                    }
                                                </StyledDashboardOpportunityItemBLs>
                                            </StyledDashboardOpportunityItem>
                                        </Link>
                                    )
                                })}
                            </StyledDashboardOpportunitiesListContainer>
                        </>
                    }
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
                :( 
                    <StyledDashboardOpprtunityCTAOrSpinnerContainer>
                        <Spinner />
                    </StyledDashboardOpprtunityCTAOrSpinnerContainer>
                )}
    </Card>
  )
}
