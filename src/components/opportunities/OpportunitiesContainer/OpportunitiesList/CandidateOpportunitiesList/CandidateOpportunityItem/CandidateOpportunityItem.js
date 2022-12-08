import React from 'react';
import PropTypes from 'prop-types';

import { findConstantFromValue, findOfferStatus } from 'src/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { BUSINESS_LINES, OFFER_STATUS } from 'src/constants';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel/ContractLabel';
import ProgressBarStatus from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus';
import Button from 'src/components/utils/Button';
import ActionLabels from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ActionLabels';
import {
  Company,
  Container,
  Description,
  BottomContainer,
  DescriptionTitle,
  TopContainer,
  TitleContainer,
  Icon,
  Title,
  Info,
  DescriptionContainer,
  ActionContainer,
} from './CandidateOpportunityItem.styles';

const CandidateOpportunityItem = ({
  title,
  company,
  description,
  bookmarked,
  isNew,
  isExternal,
  archived,
  recommended,
  isPublic,
  date,
  opportunityUsers,
  isValidated,
  department,
  contract,
  endOfContract,
  startOfContract,
  businessLines,
}) => {
  const opportunityUsersWithoutDefaultStatus = Array.isArray(opportunityUsers)
    ? opportunityUsers.filter((oppUser) => {
        return oppUser.status !== OFFER_STATUS[0].value || oppUser.recommended;
      })
    : null;

  const specificOpportunityUser =
    opportunityUsers && !Array.isArray(opportunityUsers)
      ? opportunityUsers
      : null;

  const shouldShowRecommandationBadge =
    isPublic && (specificOpportunityUser?.recommended || recommended);

  const background = archived ? 'secondary' : 'default';

  return (
    <Container>
      <TopContainer>
        <Icon>
          <IconNoSSR name="home" ratio={1.5} />
        </Icon>
        <TitleContainer>
          <Title>{title}</Title>
          <Company>
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
          </Company>
          <Info>
            <ContractLabel
              contract={contract}
              endOfContract={endOfContract}
              startOfContract={startOfContract}
            />
            &nbsp;-&nbsp;{department}
          </Info>
        </TitleContainer>
        <ActionContainer>
          <ActionLabels
            color="yellow"
            label="À traiter rapidement"
            icon={<IconNoSSR name="star" ratio={0.8} />}
          />
        </ActionContainer>
      </TopContainer>
      <ProgressBarStatus status={opportunityUsers.status} />
      <BottomContainer>
        <DescriptionTitle>Description mission</DescriptionTitle>
        <DescriptionContainer>
          <Description>{description}</Description>
        </DescriptionContainer>
      </BottomContainer>
    </Container>
  );
};

CandidateOpportunityItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bookmarked: PropTypes.bool,
  archived: PropTypes.bool,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  recommended: PropTypes.bool,
  isNew: PropTypes.bool,
  isPublic: PropTypes.bool,
  isExternal: PropTypes.bool,
  date: PropTypes.string,
  opportunityUsers: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.arrayOf(PropTypes.shape()),
  ]),
  isValidated: PropTypes.bool,
  department: PropTypes.string,
  businessLines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    })
  ),
};

CandidateOpportunityItem.defaultProps = {
  bookmarked: undefined,
  archived: undefined,
  recommended: undefined,
  isNew: undefined,
  isPublic: undefined,
  isExternal: undefined,
  isValidated: undefined,
  date: undefined,
  opportunityUsers: undefined,
  department: undefined,
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
  businessLines: undefined,
};
export default CandidateOpportunityItem;
