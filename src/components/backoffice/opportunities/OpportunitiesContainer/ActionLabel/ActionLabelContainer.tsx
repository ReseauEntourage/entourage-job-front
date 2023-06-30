import React from 'react';
import EntourageIcon from 'assets/custom/icons/entourage.svg';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
import { Icon } from 'src/components/utils';

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
          fill
          color="yellow"
          label="À traiter rapidement"
          icon={<Icon name="star" ratio={0.8} />}
        />
      )}
      {isPublic && isRecommended && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Recommandée"
          icon={<EntourageIcon viewBox="-1 6 16 10" height={16} width={10} />}
        />
      )}
      {isPublic && isBookmarked && (
        <ActionLabel
          fill
          color="primaryOrange"
          label="Favoris"
          onClick={bookmarkOpportunity}
          id="cta-unbookmark"
          icon={<Icon name="heart" ratio={0.8} />}
        />
      )}
      {isExternal && (
        <ActionLabel
          disabled
          fill
          color="primaryOrange"
          label="Perso"
          icon={<Icon name="heart" ratio={0.8} />}
        />
      )}
      {isPublic && !isRecommended && !isBookmarked && (
        <ActionLabel
          hoverAnimation
          color="primaryOrange"
          label="Ajouter aux favoris"
          onClick={bookmarkOpportunity}
          id="cta-bookmark"
          icon={<Icon name="heart" ratio={0.8} />}
        />
      )}
    </>
  );
};