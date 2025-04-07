import React from 'react';
import { Review } from 'src/api/types';
import { Text } from 'src/components/utils';
import {
  StyledReviewAuthorContainer,
  StyledReviewItem,
} from './ProfileReviews.styles';

export interface ReviewItemProps {
  review: Review;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <StyledReviewItem>
      <Text textAlign="justify">&quot;{review.content}&quot;</Text>
      <StyledReviewAuthorContainer>
        <Text color="mediumGray" size="small">
          {review.authorName}
        </Text>
        <Text color="mediumGray" size="small">
          {review.authorLabel}
        </Text>
      </StyledReviewAuthorContainer>
    </StyledReviewItem>
  );
};
