import React from 'react';
import { IconName, LucidIcon } from '@/src/components/ui/Icons';
import {
  TIME_PER_CARD,
  StyledCard,
  StyledCardGrid,
  StyledContainer,
  StyledSubtitle,
  StyledTitle,
  StyledTitles,
} from './SearchingLoader.styles';

interface SearchingLoaderProps {
  title: string;
  subtitle: string;
  theme?: 'dark' | 'light';
  cols?: number;
  rows?: number;
  cardIcon?: IconName;
}

export const SearchingLoader = ({
  title,
  subtitle,
  theme = 'dark',
  cols = 4,
  rows = 2,
  cardIcon = 'User',
}: SearchingLoaderProps) => {
  const totalCards = cols * rows;
  const cycle = totalCards * TIME_PER_CARD;

  return (
    <StyledContainer>
      <StyledCardGrid $cols={cols} $rows={rows}>
        {Array.from({ length: totalCards }).map((_, idx) => (
          <StyledCard
            key={idx}
            $idx={idx}
            $total={totalCards}
            $cycle={cycle}
            $theme={theme}
          >
            <LucidIcon
              name={cardIcon}
              size={16}
              color="currentColor"
              stroke="thin"
            />
          </StyledCard>
        ))}
      </StyledCardGrid>
      <StyledTitles>
        <StyledTitle $theme={theme}>{title}</StyledTitle>
        <StyledSubtitle $theme={theme}>{subtitle}</StyledSubtitle>
      </StyledTitles>
    </StyledContainer>
  );
};
