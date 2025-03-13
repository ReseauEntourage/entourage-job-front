import React, { useCallback } from 'react';
import { IlluMalette } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Text } from 'src/components/utils';
import { StyledProfileReviewsList } from './ProfileReviews.styles';

export type Review = {
  id?: string;
  name: string;
  text: string;
  status: string;
};

export interface ProfileReviewsProps {
  reviews?: Review[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileReviews = ({
  reviews = [],
  isEditable = false,
  smallCard = false,
}: ProfileReviewsProps) => {
  const isCompleted = reviews.length > 0;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Recommandations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
      smallCard={smallCard}
      fallback={{
        content: <Text>Vous n’avez pas encore de recommandation</Text>,
        icon: <IlluMalette />,
      }}
    >
      <StyledProfileReviewsList>
        {reviews.map((review: Review) => {
          return <>Ma review {review.id}</>;
        })}
      </StyledProfileReviewsList>
    </ProfilePartCard>
  );
};
