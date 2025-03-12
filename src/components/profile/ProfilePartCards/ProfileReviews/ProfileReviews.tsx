import React, { useCallback } from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
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
}

export const ProfileReviews = ({
  reviews = [],
  isEditable = false,
}: ProfileReviewsProps) => {
  const isCompleted = reviews.length > 0;

  const editModal = useCallback(() => {}, []);

  return (
    <ProfilePartCard
      title="Recommandations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
    >
      <StyledProfileReviewsList>
        {reviews.map((review: Review) => {
          return <>Ma review {review.id}</>;
        })}
      </StyledProfileReviewsList>
    </ProfilePartCard>
  );
};
