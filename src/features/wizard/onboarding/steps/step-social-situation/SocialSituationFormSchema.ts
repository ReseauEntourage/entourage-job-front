import {
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_RESOURCES_FILTERS,
  JOB_SEARCH_DURATIONS_FILTERS,
  NATIONALITIES_FILTERS,
  STUDIES_LEVELS_FILTERS,
  WORKING_EXPERIENCE_FILTERS,
  YES_NO_JNSPR_FILTERS,
} from '@/src/constants';
import { FormFieldInput, FormSchema } from '@/src/features/forms/FormSchema';
import { AnyCantFix } from '@/src/utils/Types';

export const personnalSocialSituationFormFields: FormFieldInput<AnyCantFix>[] =
  [
    {
      id: 'nationality',
      name: 'nationality',
      title: 'Quelle est votre nationalité ?',
      component: 'select-simple',
      options: NATIONALITIES_FILTERS,
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      title: "Dans quelle situation d'hébergement êtes-vous ?",
      component: 'select-simple',
      options: CANDIDATE_ACCOMMODATIONS_FILTERS,
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'hasSocialWorker',
      name: 'hasSocialWorker',
      title: 'Bénéficiez-vous d’un accompagnement social ?',
      component: 'select-simple',
      options: YES_NO_JNSPR_FILTERS,
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'resources',
      name: 'resources',
      component: 'select-simple',
      options: CANDIDATE_RESOURCES_FILTERS,
      title: 'Quelles sont vos sources de revenus ?',
      showLabel: true,
      showOptional: true,
    },
  ];

export const professionnalSocialSituationFormFields: FormFieldInput<AnyCantFix>[] =
  [
    {
      id: 'jobSearchDuration',
      name: 'jobSearchDuration',
      title: "Depuis combien de temps êtes-vous en recherche d'emploi ?",
      component: 'select-simple',
      options: JOB_SEARCH_DURATIONS_FILTERS,
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'studiesLevel',
      name: 'studiesLevel',
      title: 'Quel est votre niveau d’études ?',
      component: 'select-simple',
      options: STUDIES_LEVELS_FILTERS,
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'workingExperience',
      name: 'workingExperience',
      title: "Nombre d'années d'expérience professionnelle",
      component: 'select-simple',
      options: WORKING_EXPERIENCE_FILTERS,
      showLabel: true,
      showOptional: true,
    },
  ];

export const socialSituationFormSchema: FormSchema<AnyCantFix> = {
  id: 'form-onboarding-profile-completion',
  fields: [
    {
      id: 'personalInfoHeading',
      name: 'personalInfoHeading',
      title: 'Informations personnelles',
      component: 'heading',
    },
    ...personnalSocialSituationFormFields,
    {
      id: 'professionalInfoHeading',
      name: 'professionalInfoHeading',
      title: 'Informations professionnelles',
      component: 'heading',
    },
    ...professionnalSocialSituationFormFields,
  ],
};
