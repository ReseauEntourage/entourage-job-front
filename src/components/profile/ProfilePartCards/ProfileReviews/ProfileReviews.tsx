import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IlluMalette } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Review } from 'src/api/types';
import { Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileReviewsList } from './ProfileReviews.styles';
import { ReviewItem } from './ReviewItem';

export interface ProfileReviewsProps {
  userId: string;
  userFirstName: string;
  reviews?: Review[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileReviews = ({
  userId,
  userFirstName,
  reviews = [],
  isEditable = false,
  smallCard = false,
}: ProfileReviewsProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnProfile = userId === currentUserId;
  const isCompleted = reviews.length > 0;
  const suggestReview = useCallback(() => {
    // console.log('suggestMyReview');
  }, []);

  const fallback = useMemo(() => {
    const content = isEditable ? (
      <Text>Vous n’avez pas encore de recommandation</Text>
    ) : (
      <Text>{`Aucune recommandation pour ${userFirstName}`}</Text>
    );
    return {
      content,
      icon: <IlluMalette />,
    };
  }, [isEditable, userFirstName]);

  return (
    <ProfilePartCard
      title="Recommandations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaTitle={!isOwnProfile ? `Recommander ${userFirstName}` : undefined}
      smallCard={smallCard}
      fallback={fallback}
      ctaCallback={!isOwnProfile ? suggestReview : undefined}
    >
      <StyledProfileReviewsList>
        {reviews.map((review: Review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </StyledProfileReviewsList>
    </ProfilePartCard>
  );
};
