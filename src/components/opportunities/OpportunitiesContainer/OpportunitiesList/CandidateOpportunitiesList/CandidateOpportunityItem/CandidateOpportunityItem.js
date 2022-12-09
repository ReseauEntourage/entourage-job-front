import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { BUSINESS_LINES, OFFER_STATUS } from 'src/constants';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel/ContractLabel';
import ProgressBarStatus from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ProgressBarStatus';
import ActionLabels from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/ActionLabels';
import Api from 'src/api/index.ts';
import UIkit from 'uikit';
import EntourageIcon from './entourage.svg';
import {
  Company,
  Container,
  Description,
  BottomContainer,
  DescriptionTitle,
  TopContainer,
  TitleContainer,
  Title,
  Info,
  DescriptionContainer,
  ActionContainer,
} from './CandidateOpportunityItem.styles';

const CandidateOpportunityItem = ({
  id,
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
  const [opportunityUser, setOpportunityUser] = useState(opportunityUsers);

  const opportunityUsersWithoutDefaultStatus = Array.isArray(opportunityUsers)
    ? opportunityUsers.filter((oppUser) => {
        return oppUser.status !== OFFER_STATUS[0].value || oppUser.recommended;
      })
    : null;

  const bookmarkOpportunity = useCallback(async () => {
    try {
      const opportunityUser = opportunityUsers;
      if (!opportunityUser) {
        const { data: opportunityUser } = await Api.postJoinOpportunity({
          opportunityId: id,
          candidateId,
        });
      }
      const {
        data: { bookmarked: updatedBookmarked },
      } = await Api.putJoinOpportunity({
        ...opportunityUser,
        bookmarked: !bookmarkedState,
      });

      setBookmarkedState(updatedBookmarked);
    } catch (err) {
      console.error(err);
      UIkit.notification(
        "Une erreur s'est produite lors de l'ajout de l'offre aux favoris",
        'danger'
      );
    }
  }, [bookmarkedState, id, opportunityUsers]);

  return (
    <Container>
      <TopContainer>
        {/*    <Icon>
          <IconNoSSR name="home" ratio={1.5} />
        </Icon> */}
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
          {!isPublic && (
            <ActionLabels
              disabled
              fill
              color="yellow"
              label="À traiter rapidement"
              icon={<IconNoSSR name="star" ratio={0.8} />}
            />
          )}
          {isPublic && recommended && (
            <ActionLabels
              disabled
              fill
              color="primaryOrange"
              label="Recommandée"
              icon={
                <EntourageIcon viewBox="0 0 16 11" height={16} width={11} />
              }
            />
          )}
          {(isExternal || bookmarked) && (
            <ActionLabels
              fill
              color="primaryOrange"
              label="Favoris"
              onClick={bookmarkOpportunity}
              icon={<IconNoSSR name="heart" ratio={0.8} />}
            />
          )}
          {isPublic && !recommended && !bookmarked && (
            <ActionLabels
              hoverAnimation
              color="primaryOrange"
              label="Ajouter aux favoris"
              onClick={bookmarkOpportunity}
              icon={<IconNoSSR name="heart" ratio={0.8} />}
            />
          )}
        </ActionContainer>
      </TopContainer>
      <ProgressBarStatus status={opportunityUsers?.status} />
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
