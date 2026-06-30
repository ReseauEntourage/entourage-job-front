import React from 'react';
import { Text } from '@/src/components/ui';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { StyledSkeletonsContainer } from './WizardSearchingLoader.styles';

export interface WizardSearchingLoaderVariant {
  title: string;
  subtitle: string;
}

export const SEARCHING_LOADER_VARIANTS = {
  preRegistrationCriteria: {
    title: 'Nous recherchons des profils compatibles',
    subtitle: 'Selon les critères que vous avez choisis',
  },
  preRegistrationSectors: {
    title: 'Nous recherchons des profils compatibles',
    subtitle: 'Selon les secteurs que vous avez choisis',
  },
  embeddingPending: {
    title: 'Nous analysons les modifications récentes de votre profil',
    subtitle: 'Encore quelques instants...',
  },
  computingReco: {
    title: 'Nous recherchons des profils compatibles',
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
  <>
    <Text size="large" weight="semibold" color="darkGray" center>
      {title}
    </Text>
    <Text color="darkGray" center>
      {subtitle}
    </Text>
    <StyledSkeletonsContainer>
      <Skeleton count={3} width="100%" height="150px" inverted />
    </StyledSkeletonsContainer>
  </>
);
