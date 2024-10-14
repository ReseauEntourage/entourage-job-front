import React from 'react';
import EntourageIcon from 'assets/icons/entourage.svg';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';

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
          icon={<LucidIcon name="Star" size={16} />}
        />
      )}
      {isPublic && isRecommended && (
        <ActionLabel
          disabled
          color="primaryBlue"
          label="Recommandée"
          icon={<EntourageIcon height={16} width={10} />}
        />
      )}
      {isPublic && isBookmarked && (
        <ActionLabel
          color="primaryBlue"
          label="Favoris"
          onClick={bookmarkOpportunity}
          id="cta-unbookmark"
          icon={
            <LucidIcon
              name="Heart"
              size={16}
              style="solid"
              color={COLORS.primaryBlue}
            />
          }
        />
      )}
      {isExternal && (
        <ActionLabel
          disabled
          color="primaryBlue"
          label="Perso"
          icon={<LucidIcon name="Heart" size={16} />}
        />
      )}
      {isPublic && !isRecommended && !isBookmarked && (
        <ActionLabel
          hoverAnimation
          color="primaryBlue"
          label="Ajouter aux favoris"
          onClick={bookmarkOpportunity}
          id="cta-bookmark"
          icon={<LucidIcon name="Heart" size={16} />}
        />
      )}
    </>
  );
};
