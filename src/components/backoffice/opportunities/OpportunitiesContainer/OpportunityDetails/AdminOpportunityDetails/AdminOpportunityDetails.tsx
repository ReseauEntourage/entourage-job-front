import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import React, { useRef, useState } from 'react'
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { HEIGHTS } from 'src/constants/styles';
import {
    StyledOpportunityDetailsCTAContainer,
    StyledOpportunityDetailsContainer,
    StyledOpportunityDetailsDetailsContentContainer,
    StyledOpportunityDetailsInfoContainer,
    StyledOpportunityDetailsRightContainer,
    StyledOpportunityDetailsTitleContainer,
    StyledOpportunityDetailsTopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import {
    InfoText,
    RightAlignText,
    StyledTitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { findConstantFromValue } from 'src/utils';
import { BUSINESS_LINES, adminOffersTags } from 'src/constants';
import { ContractLabel } from '../../ContractLabel';
import moment from 'moment';
import { CandidateOpportunityDetailsCTAs } from '../CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs';
import { OpportunitySection } from '../OpportunitySection';
import { AdminOpportunityDetailsCTAs } from './AdminOpportunityDetailsCTAs';
    




interface AdminOpportunityDetailsProps{
  opportunity: AdminOpportunityWithOpportunityUsers;
  fetchOpportunities: () => void;
  oppRefreshCallback: () => void;
  currentTag: {value: adminOffersTags; label: string;};
}

export const AdminOpportunityDetails = ({
    opportunity,
    fetchOpportunities,
    oppRefreshCallback,
    currentTag,
  }: AdminOpportunityDetailsProps) => {

 const {
    id,
    title,
    company,
    businessLines,
    contract,
    endOfContract,
    startOfContract,
    department,
    companyDescription,
    description,
    opportunityUsers: opportunityUsersProp,
    isPublic,
    isExternal,
    createdAt,
    } = opportunity;
    const ref = useRef();
    const windowHeight = useWindowHeight();

    const [containerHeight, setContainerHeight] = useState(0);


    useScrollPosition(
        ({ currPos }) => {
          const conditionalHeight = HEIGHTS.OFFER_CTA_HEIGHT
          const bottom =
            windowHeight - HEIGHTS.HEADER - HEIGHTS.TABS_HEIGHT - conditionalHeight;
    
          const calculatedContainerHeight = bottom - currPos.y;
    
          setContainerHeight(
            calculatedContainerHeight < 2 * HEIGHTS.SECTION_PADDING
              ? 2 * HEIGHTS.SECTION_PADDING
              : calculatedContainerHeight
          );
        },
        [windowHeight],
        ref
      );
    
      return (
        
            
        <StyledOpportunityDetailsContainer ref={ref} data-testid="candidat-offer-details">

         <StyledOpportunityDetailsTopContainer>
            <StyledOpportunityDetailsTitleContainer>
              <StyledTitleText data-testid="candidat-offer-details-title">
                {title}
              </StyledTitleText>
              <InfoText>
                {company}
                {businessLines && businessLines.length > 0 && (
                  <>
                    &nbsp;-&nbsp;
                    {businessLines
                      .map(({ name }) => {
                        return findConstantFromValue(name, BUSINESS_LINES).label;
                      })
                      .join(' | ')}
                  </>
                )}
              </InfoText>
              <InfoText>
                <StyledOpportunityDetailsInfoContainer>
                  <ContractLabel
                    contract={contract}
                    endOfContract={endOfContract}
                    startOfContract={startOfContract}
                  />
                  &nbsp;-&nbsp;{department}
                </StyledOpportunityDetailsInfoContainer>
              </InfoText>
              <InfoText>{moment(createdAt).format('DD/MM/YYYY')}</InfoText>
            </StyledOpportunityDetailsTitleContainer>

            {/*<StyledOpportunityDetailsRightContainer>
               <ActionLabels
                isBookmarked={!!opportunityUsers?.bookmarked}
                isRecommended={!!opportunityUsers?.recommended}
                isPublic={isPublic}
                isExternal={isExternal}
                bookmarkOpportunity={async () => {
                  await bookmarkOpportunity();
                  await fetchOpportunities();
                }}
              /> 
                
            </StyledOpportunityDetailsRightContainer>*/}
            
        </StyledOpportunityDetailsTopContainer>

        {/* check if there are CTAS on the current tab to render ctas container */}
        <StyledOpportunityDetailsCTAContainer>
               <AdminOpportunityDetailsCTAs
                tag={currentTag}
                opportunity={opportunity}
                oppRefreshCallback={() => {
                  oppRefreshCallback();
                }}
                fetchOpportunities={async () => {
                  await fetchOpportunities();
                }}
              /> 
        </StyledOpportunityDetailsCTAContainer>

        {(companyDescription || description) && (
            <StyledOpportunityDetailsDetailsContentContainer
              height={containerHeight === 0 ? '100%' : containerHeight}
            >
              {companyDescription && (
                <OpportunitySection
                  title="Information sur l'entreprise"
                  content={companyDescription}
                />
              )}
              {description && (
                <OpportunitySection
                  title="Détail de l'offre"
                  content={description}
                />
              )}
            </StyledOpportunityDetailsDetailsContentContainer>
          )}

        </StyledOpportunityDetailsContainer>
        /* <ModalOffer
          currentOffer={opportunity}
          onOfferUpdated={fetchOpportunities}
        /> */

      );
}