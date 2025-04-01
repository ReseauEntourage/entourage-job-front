import React, { useState } from 'react';
import { Star } from 'assets/icons/icons';
import { StyledStarRating } from './StarRating.styles';

interface StarRatingProps {
  onClick: (rating: number) => void;
}

export const StarRating = ({ onClick }: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  const onStarRatingClick = (ratingValue: number) => {
    onClick(ratingValue);
  };

  return (
    <StyledStarRating onMouseLeave={() => setHover(null)}>
      {[...Array(5)].map((_, i) => {
        const ratingValue: number = i + 1;
        const shouldFill = hover && ratingValue <= hover;
        return (
          <div key={i}>
            <Star
              size={50}
              onMouseEnter={() => setHover(ratingValue)}
              onClick={() => onStarRatingClick(ratingValue)}
              className={shouldFill ? 'activeStar' : 'star'}
            />
          </div>
        );
      })}
    </StyledStarRating>
  );
};
