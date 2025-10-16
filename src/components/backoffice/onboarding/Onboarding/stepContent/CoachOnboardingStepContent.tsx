import React from 'react';
import { User } from '@/src/api/types';
import { isReadDocument } from '@/src/components/partials/pages/Documents/Documents.utils';
import { EthicsCharter } from '@/src/components/utils/EthicsCharter/EthicsCharter';
import { DocumentNames } from '@/src/constants';
import { getCoachDefaultProfessionalValuesWithLinkedIn } from '../../../parameters/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { OnboardingProfileForm } from '../forms/OnboardingProfileForm';
import { formOnboardingCoachJob } from '../forms/schemas/formOnboardingCoachJob';
import { formOnboardingCoachNudges } from '../forms/schemas/formOnboardingCoachNudges';
import { formOnboardingCoachProfile } from '../forms/schemas/formOnboardingCoachProfile';
import { formOnboardingEthicsCharter } from '../forms/schemas/formOnboardingEthicsCharter';

export const CoachOnboardingStepContents = {
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
    title: 'Complétez votre profil',
    subtitle:
      "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur ce que vous souhaitez apporter aux candidats",
    form: formOnboardingCoachNudges,
    defaultValues: (user) => ({
      nudgeIds: user.userProfile?.nudges?.map((nudge) => nudge.id) ?? [],
    }),
    skippedBy: (user: User) =>
      !!(user.userProfile?.nudges && user.userProfile?.nudges.length > 0),
  },
  3: {
    title: 'Complétez votre profil',
    subtitle:
      "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
    form: formOnboardingCoachJob,
    defaultValues: (user) => {
      return getCoachDefaultProfessionalValuesWithLinkedIn(
        user.userProfile,
        user.company
      );
    },
    skippedBy: (user: User) =>
      !!(
        user.userProfile?.sectorOccupations &&
        user.userProfile?.sectorOccupations.length > 0
      ),
  },
  4: {
    title: 'Complétez votre profil',
    subtitle:
      "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
    form: formOnboardingCoachProfile,
    content: <OnboardingProfileForm />,
    defaultValues: (user) => ({
      introduction: user.userProfile.introduction ?? undefined,
    }),
    skippedBy: ({ userProfile }: User) => !!userProfile.introduction,
  },
};
