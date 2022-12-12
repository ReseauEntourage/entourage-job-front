import ActionLabel from 'src/components/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
import { IconNoSSR } from 'src/components/utils/Icon';
import EntourageIcon from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem/entourage.svg';
import React from 'react';
import PropTypes from 'prop-types';

const ActionLabels = ({
  isPublic,
  isRecommended,
  isBookmarked,
  isExternal,
  bookmarkOpportunity,
}) => {
  return (
    <>
      {!isPublic && !isExternal && (
        <ActionLabel
          disabled
          fill
          color="yellow"
          label="À traiter rapidement"
          icon={<IconNoSSR name="star" ratio={0.8} />}
        />
      )}
      {isPublic && isRecommended && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Recommandée"
          icon={<EntourageIcon viewBox="0 0 16 11" height={16} width={11} />}
        />
      )}
      {isPublic && isBookmarked && (
        <ActionLabel
          fill
          color="primaryOrange"
          label="Favoris"
          onClick={bookmarkOpportunity}
          icon={<IconNoSSR name="heart" ratio={0.8} />}
        />
      )}
      {isExternal && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Favoris"
          icon={<IconNoSSR name="heart" ratio={0.8} />}
        />
      )}
      {isPublic && !isRecommended && !isBookmarked && (
        <ActionLabel
          hoverAnimation
          color="primaryOrange"
          label="Ajouter aux favoris"
          onClick={bookmarkOpportunity}
          icon={<IconNoSSR name="heart" ratio={0.8} />}
        />
      )}
    </>
  );
};

ActionLabels.propTypes = {
  isPublic: PropTypes.bool.isRequired,
  isRecommended: PropTypes.bool.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
  bookmarkOpportunity: PropTypes.func.isRequired,
};

export default ActionLabels;
