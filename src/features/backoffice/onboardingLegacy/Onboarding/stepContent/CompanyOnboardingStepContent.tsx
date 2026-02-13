import React from 'react';
import { User } from '@/src/api/types';
import { EthicsCharter } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { DocumentNames } from '@/src/constants';
import { isReadDocument } from '@/src/features/partials/pages/Documents/Documents.utils';
import { formOnboardingCompanyGoal } from '../forms/schemas/formOnboardingCompanyGoal';
import { formOnboardingCompanyInformation } from '../forms/schemas/formOnboardingCompanyInformation';
import { formOnboardingEthicsCharter } from '../forms/schemas/formOnboardingEthicsCharter';

export const CompanyOnboardingStepContents = {
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
    title: 'Quelles sont vos attentes avec Entourage Pro',
    subtitle: 'Sélectionnez la ou les actions que vous souhaitez entreprendre',
    skippedBy: (user: User) => {
      return !!user.company?.goal;
    },
    form: formOnboardingCompanyGoal,
  },
  3: {
    title: 'Renseignez les informations de votre entreprise',
    subtitle:
      'Ces informations seront visibles par tous les utilisateurs de la plateforme',
    form: formOnboardingCompanyInformation,
  },
};
