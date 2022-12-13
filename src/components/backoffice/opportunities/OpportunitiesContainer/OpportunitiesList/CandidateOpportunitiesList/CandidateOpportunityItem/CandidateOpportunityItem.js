import React from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { BUSINESS_LINES } from 'src/constants';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import ProgressBarStatus from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus/ProgressBarStatus';
import ActionLabels from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { useBookmarkOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useBookmarkOpportunity';
import {
  DescriptionText,
  InfoText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  ActionContainer,
  BottomContainer,
  Container,
  Description,
  InfoContainer,
  TitleContainer,
  TopContainer,
} from './CandidateOpportunityItem.styles';

const CandidateOpportunityItem = ({
  id,
  title,
  company,
  description,
  isExternal,
  isPublic,
  opportunityUsers: opportunityUsersProp,
  department,
  contract,
  endOfContract,
  startOfContract,
  businessLines,
}) => {
  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  return (
    <Container>
      <TopContainer>
        {/*
          <Icon>
            <IconNoSSR name="home" ratio={1.5} />
          </Icon>
        */}
        <TitleContainer>
          <SubtitleText>{title}</SubtitleText>
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
            <InfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </InfoContainer>
          </InfoText>
        </TitleContainer>
        <ActionContainer>
          <ActionLabels
            isBookmarked={!!opportunityUsers?.bookmarked}
            isRecommended={!!opportunityUsers?.recommended}
            isPublic={isPublic}
            isExternal={isExternal}
            bookmarkOpportunity={bookmarkOpportunity}
          />
        </ActionContainer>
      </TopContainer>
      <ProgressBarStatus status={opportunityUsers?.status} />
      <BottomContainer>
        <SubtitleText>Description mission</SubtitleText>
        <Description>
          <DescriptionText>{description}</DescriptionText>
        </Description>
      </BottomContainer>
    </Container>
  );
};

CandidateOpportunityItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  isPublic: PropTypes.bool,
  isExternal: PropTypes.bool,
  opportunityUsers: PropTypes.oneOfType([
    PropTypes.shape({
      status: PropTypes.number,
      bookmarked: PropTypes.bool,
      recommended: PropTypes.bool,
      note: PropTypes.string,
      archived: PropTypes.bool,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        recommended: PropTypes.bool,
        note: PropTypes.string,
        archived: PropTypes.bool,
      })
    ),
  ]),
  department: PropTypes.string,
  businessLines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    })
  ),
};

CandidateOpportunityItem.defaultProps = {
  isPublic: undefined,
  isExternal: undefined,
  opportunityUsers: undefined,
  department: undefined,
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
  businessLines: undefined,
};
export default CandidateOpportunityItem;
