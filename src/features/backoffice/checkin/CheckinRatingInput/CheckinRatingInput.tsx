import React from 'react';
import { Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledCheckinRatingInput,
  StyledCheckinRatingStar,
} from './CheckinRatingInput.styles';

const RATING_VALUES = [1, 2, 3, 4, 5];

interface CheckinRatingInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const CheckinRatingInput = ({
  value,
  onChange,
}: CheckinRatingInputProps) => {
  return (
    <>
      <StyledCheckinRatingInput>
        {RATING_VALUES.map((star) => (
          <StyledCheckinRatingStar
            key={star}
            type="button"
            aria-label={`Noter ${star} sur 5`}
            onClick={() => onChange(star)}
          >
            <LucidIcon
              name="Star"
              style={value !== null && star <= value ? 'solid' : 'outline'}
              color={
                value !== null && star <= value
                  ? COLORS.yellowSport
                  : COLORS.gray
              }
              size={52}
            />
          </StyledCheckinRatingStar>
        ))}
      </StyledCheckinRatingInput>
      <Text size="small" color="darkGray" center>
        1 = pas du tout satisfaisante · 5 = très satisfaisante
      </Text>
    </>
  );
};
