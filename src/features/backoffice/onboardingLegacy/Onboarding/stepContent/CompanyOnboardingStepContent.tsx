import React from 'react';
import { CurrentUserCompany, ReadDocumentItem, User } from '@/src/api/types';
import { EthicsCharter } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { DocumentNames, DocumentNameType } from '@/src/constants';
import { isReadDocument } from '@/src/features/partials/pages/Documents/Documents.utils';
import { formOnboardingCompanyGoal } from '../forms/schemas/formOnboardingCompanyGoal';
import { formOnboardingCompanyInformation } from '../forms/schemas/formOnboardingCompanyInformation';
import { formOnboardingEthicsCharter } from '../forms/schemas/formOnboardingEthicsCharter';

export const CompanyOnboardingStepContents = {
  1: {
    title: 'Charte éthique',
    skippedBy: (
      _user: User,
      {
        readDocuments,
      }: {
        readDocuments: ReadDocumentItem[];
        company: CurrentUserCompany | null;
      }
    ) => {
      return isReadDocument(readDocuments, DocumentNames.CharteEthique);
    },
    content: <EthicsCharter />,
    form: formOnboardingEthicsCharter,
    defaultValues: () => ({
      hasAcceptedEthicsCharter: false,
    }),
  },
  2: {
    title: 'Quelles sont vos attentes avec Entourage Pro',
    subtitle: 'Sélectionnez la ou les actions que vous souhaitez entreprendre',
    skippedBy: (
      _user: User,
      {
        company,
      }: {
        readDocuments: { documentName: DocumentNameType }[];
        company: CurrentUserCompany | null;
      }
    ) => {
      return !!company?.goal;
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
