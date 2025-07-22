import React from 'react';
import { User } from '@/src/api/types';
import { isReadDocument } from '@/src/components/partials/pages/Documents/Documents.utils';
import { EthicsCharter } from '@/src/components/utils/EthicsCharter/EthicsCharter';
import { DocumentNames } from '@/src/constants';
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
    title: "Profil de l'entreprise",
    subtitle:
      'Pour mieux vous connaître, merci de compléter ces informations sur votre entreprise',
    form: formOnboardingEthicsCharter, // À remplacer par le vrai formulaire d'entreprise
    // skippedBy: (user: User) => false, // À adapter selon les besoins
  },
  3: {
    title: "Vos offres d'emploi",
    subtitle: "Ajoutez vos premières offres d'emploi pour les candidats",
    form: formOnboardingEthicsCharter, // À remplacer par le vrai formulaire d'offres d'emploi
    // skippedBy: (user: User) => false, // À adapter selon les besoins
  },
};
