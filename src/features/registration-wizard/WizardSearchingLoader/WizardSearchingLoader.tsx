import React from 'react';
import { SearchingLoader } from '@/src/components/ui/SearchingLoader';

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
  <SearchingLoader title={title} subtitle={subtitle} theme="light" />
);
