import { FormSchema } from 'src/components/forms/FormSchema';
import {
  CandidateAccommodation,
  CandidateResource,
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_RESOURCES_FILTERS,
  JobSearchDuration,
  JOB_SEARCH_DURATIONS_FILTERS,
  NATIONALITIES_FILTERS,
  Nationality,
  StudiesLevel,
  STUDIES_LEVELS_FILTERS,
  WorkingExperience,
  WORKING_EXPERIENCE_FILTERS,
  YesNoJNSPRValue,
  YES_NO_JNSPR_FILTERS,
} from 'src/constants';

export const formReferingSocialSituation: FormSchema<{
  nationality: Nationality;
  accommodation: CandidateAccommodation;
  hasSocialWorker: YesNoJNSPRValue;
  resources: CandidateResource;
  jobSearchDuration: JobSearchDuration;
  studiesLevel: StudiesLevel;
  workingExperience: WorkingExperience;
}> = {
  id: 'form-refering-candidate-social-situation',
  fields: [
    {
      id: 'nationality',
      name: 'nationality',
      title: 'Quelle est votre nationalité du candidat ?',
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
      title: 'Quelle sont ses sources de revenu ?',
      showLabel: true,
      showOptional: true,
    },
    {
      id: 'jobSearchDuration',
      name: 'jobSearchDuration',
      title:
        "Depuis combien de temps le candidat est-il en recherche d'emploi ?",
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
  ],
};
