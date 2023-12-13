import React from 'react';
import EntourageIcon from 'assets/icons/entourage.svg';
import HeartEmptyIcon from 'assets/icons/heart-empty.svg';
import HeartIcon from 'assets/icons/heart.svg';
import StarIcon from 'assets/icons/star.svg';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';

interface ActionLabelContainerProps {
  isPublic: boolean;
  isRecommended: boolean;
  isBookmarked: boolean;
  isExternal: boolean;
  bookmarkOpportunity: () => void;
}
export const ActionLabelContainer = ({
  isPublic,
  isRecommended,
  isBookmarked,
  isExternal,
  bookmarkOpportunity,
}: ActionLabelContainerProps) => {
  return (
    <>
      {!isPublic && !isExternal && (
        <ActionLabel
          disabled
          color="yellow"
          label="À traiter rapidement"
          icon={<StarIcon />}
        />
      )}
      {isPublic && isRecommended && (
        <ActionLabel
          disabled
          color="primaryOrange"
          label="Recommandée"
          icon={<EntourageIcon height={16} width={10} />}
        />
      )}
      {isPublic && isBookmarked && (
        <ActionLabel
          color="primaryOrange"
          label="Favoris"
          onClick={bookmarkOpportunity}
          id="cta-unbookmark"
          icon={<HeartIcon />}
        />
      )}
      {isExternal && (
        <ActionLabel
          disabled
          color="primaryOrange"
          label="Perso"
          icon={<HeartIcon />}
        />
      )}
      {isPublic && !isRecommended && !isBookmarked && (
        <ActionLabel
          hoverAnimation
          color="primaryOrange"
          label="Ajouter aux favoris"
          onClick={bookmarkOpportunity}
          id="cta-bookmark"
          icon={<HeartEmptyIcon />}
        />
      )}
    </>
  );
};
