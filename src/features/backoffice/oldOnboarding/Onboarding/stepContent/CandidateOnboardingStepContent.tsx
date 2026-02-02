import React from 'react';
import { User } from '@/src/api/types';
import { EthicsCharter } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { DocumentNames } from '@/src/constants';
import { isReadDocument } from '@/src/features/partials/pages/Documents/Documents.utils';
import { getCandidateDefaultProfessionalValues } from '../../../parameters/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ProfileGenerationProcess } from '../../../profile/ProfileGenerationProcess/ProfileGenerationProcess';
import { OnboardingCandidateSocialSituation } from '../forms/OnboardingCandidateSocialSituation';
import { OnboardingProfileForm } from '../forms/OnboardingProfileForm';
import { formOnboardingCandidateAI } from '../forms/schemas/formOnboardingCandidateAI';
import { formOnboardingCandidateJob } from '../forms/schemas/formOnboardingCandidateJob';
import { formOnboardingCandidateProfile } from '../forms/schemas/formOnboardingCandidateProfile';
import { formOnboardingCandidateSocialSituation } from '../forms/schemas/formOnboardingCandidateSocialSituation';
import { formOnboardingEthicsCharter } from '../forms/schemas/formOnboardingEthicsCharter';

// Nouvelle structure pour l'onboarding des candidats
export const CandidateOnboardingStepContents = {
  1: {
    title: 'Charte éthique',
    skippedBy: (user: User) => {
      return isReadDocument(user.readDocuments, DocumentNames.CharteEthique);
    },
    content: <EthicsCharter />,
    form: formOnboardingEthicsCharter,
    defaultValues: (user) => ({
      hasAcceptedEthicsCharter: isReadDocument(
        user.readDocuments,
        DocumentNames.CharteEthique
      ),
    }),
  },
  2: {
    title: 'Nous aimerions en savoir plus sur votre situation',
    content: <OnboardingCandidateSocialSituation />,
    skippedBy: (user: User) => {
      // If the user as already accepted the ethics charter, we skip also the social situation form because it should be displayed only once
      return !!user.userSocialSituation?.hasCompletedSurvey;
    },
    form: formOnboardingCandidateSocialSituation,
    defaultValues: (user) => ({
      hasAcceptedEthicsCharter: isReadDocument(
        user.readDocuments,
        DocumentNames.CharteEthique
      ),
    }),
  },
  3: {
    title: 'Complétez votre profil',
    subtitle:
      "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
    form: formOnboardingCandidateProfile,
    content: <OnboardingProfileForm />,
    defaultValues: (user) => ({
      introduction: user.userProfile.introduction ?? undefined,
    }),
    skippedBy: ({ userProfile }: User) => !!userProfile.introduction,
  },
  4: {
    title: 'Dites-nous en plus sur votre activité professionnelle',
    form: formOnboardingCandidateJob,
    defaultValues: (user) => {
      return getCandidateDefaultProfessionalValues(user.userProfile);
    },
    skippedBy: ({ userProfile }: User) => !!userProfile.hasExternalCv,
  },
  5: {
    title: 'Enrichissez votre profil grâce à votre CV',
    content: (
      <ProfileGenerationProcess title="Souhaitez vous completer automatiquement votre profil avec les informations de votre CV ?" />
    ),
    form: formOnboardingCandidateAI,
    skippedBy: (user: User) =>
      !user.userProfile.hasExternalCv || !!user.hasExtractedCvData,
  },
};
