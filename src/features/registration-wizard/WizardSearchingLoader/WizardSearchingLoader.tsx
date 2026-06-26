import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons';
import {
  StyledCard,
  StyledCardGrid,
  StyledContainer,
  StyledLens,
  StyledSubtitle,
  StyledTitle,
  StyledTitles,
} from './WizardSearchingLoader.styles';

const TOTAL_CARDS = 8;
const MATRIX_FLICKER_INDICES = new Set([2, 5]);

export interface WizardSearchingLoaderVariant {
  title: string;
  subtitle: string;
}

export const SEARCHING_LOADER_VARIANTS = {
  preRegistrationCriteria: {
    title: 'On recherche des profils compatibles',
    subtitle: 'Selon les critères que vous avez choisis',
  },
  preRegistrationSectors: {
    title: 'On recherche des profils compatibles',
    subtitle: 'Selon les secteurs que vous avez choisis',
  },
  embeddingPending: {
    title: 'On analyse votre profil',
    subtitle: 'Encore quelques instants...',
  },
  computingReco: {
    title: 'On recherche des profils compatibles',
    subtitle: 'Selon votre profil',
  },
} satisfies Record<string, WizardSearchingLoaderVariant>;

interface WizardSearchingLoaderProps {
  title: string;
  subtitle: string;
}

export const WizardSearchingLoader = ({
  title,
  subtitle,
}: WizardSearchingLoaderProps) => (
  <StyledContainer>
    <StyledCardGrid>
      {Array.from({ length: TOTAL_CARDS }).map((_, idx) => (
        <StyledCard
          key={idx}
          $delay={idx * 0.5}
          $hasFlicker={MATRIX_FLICKER_INDICES.has(idx)}
        >
          <LucidIcon name="User" size={16} color="currentColor" stroke="thin" />
        </StyledCard>
      ))}
      <StyledLens>
        <LucidIcon name="Search" size={18} color="white" stroke="thin" />
      </StyledLens>
    </StyledCardGrid>
    <StyledTitles>
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </StyledTitles>
  </StyledContainer>
);
