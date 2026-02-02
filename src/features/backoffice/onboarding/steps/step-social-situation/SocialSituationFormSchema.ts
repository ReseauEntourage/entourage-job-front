import {
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_RESOURCES_FILTERS,
  CandidateAccommodation,
  CandidateResource,
  JOB_SEARCH_DURATIONS_FILTERS,
  JobSearchDuration,
  NATIONALITIES_FILTERS,
  Nationality,
  STUDIES_LEVELS_FILTERS,
  StudiesLevel,
  WORKING_EXPERIENCE_FILTERS,
  WorkingExperience,
  YES_NO_JNSPR_FILTERS,
  YesNoJNSPRValue,
} from '@/src/constants';
import { FormFieldInput, FormSchema } from '@/src/features/forms/FormSchema';
import { AnyCantFix } from '@/src/utils/Types';

export const socialSituationFormSchema: FormSchema<{
  nationality: Nationality;
  accommodation: CandidateAccommodation;
  hasSocialWorker: YesNoJNSPRValue;
  resources: CandidateResource;
  jobSearchDuration: JobSearchDuration;
  studiesLevel: StudiesLevel;
  workingExperience: WorkingExperience;
}> = {
  id: 'form-onboarding-profile-completion',
  fields: [],
};

export const socialSituationFormFields: FormFieldInput<AnyCantFix>[] = [
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
    title: "Dans quelle situation d'hébergement est le candidat ?",
    component: 'select-simple',
    options: CANDIDATE_ACCOMMODATIONS_FILTERS,
    showLabel: true,
    showOptional: true,
  },
  {
    id: 'hasSocialWorker',
    name: 'hasSocialWorker',
    title: 'Votre candidat bénéficie-t-il d’un accompagnement social ?',
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
    title: 'Quelles sont ses sources de revenus ?',
    showLabel: true,
    showOptional: true,
  },
  {
    id: 'jobSearchDuration',
    name: 'jobSearchDuration',
    title: "Depuis combien de temps le candidat est-il en recherche d'emploi ?",
    component: 'select-simple',
    options: JOB_SEARCH_DURATIONS_FILTERS,
    showLabel: true,
    showOptional: true,
  },
  {
    id: 'studiesLevel',
    name: 'studiesLevel',
    title: 'Quel est son niveau d’études ?',
    component: 'select-simple',
    options: STUDIES_LEVELS_FILTERS,
    showLabel: true,
    showOptional: true,
  },
  {
    id: 'workingExperience',
    name: 'workingExperience',
    title: "Nombre d'année d'expérience professionnelle",
    component: 'select-simple',
    options: WORKING_EXPERIENCE_FILTERS,
    showLabel: true,
    showOptional: true,
  },
];
