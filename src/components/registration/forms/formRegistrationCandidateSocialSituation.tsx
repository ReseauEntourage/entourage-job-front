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

export const formRegistrationCandidateSocialSituation: FormSchema<{
  nationality: Nationality;
  accommodation: CandidateAccommodation;
  hasSocialWorker: YesNoJNSPRValue;
  resources: CandidateResource;
  jobSearchDuration: JobSearchDuration;
  studiesLevel: StudiesLevel;
  workingExperience: WorkingExperience;
}> = {
  id: 'form-registration-candidate-social-situation',
  fields: [
    {
      id: 'nationality',
      name: 'nationality',
      title: 'Quelle est votre nationalité ?',
      component: 'select-simple',
      options: NATIONALITIES_FILTERS,
      showLabel: true,
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      title: "Dans quelle situation d'hébergement êtes-vous ?",
      component: 'select-simple',
      options: CANDIDATE_ACCOMMODATIONS_FILTERS,
      showLabel: true,
    },
    {
      id: 'hasSocialWorker',
      name: 'hasSocialWorker',
      title: 'Bénéficiez-vous d’un accompagnement social ?',
      component: 'select-simple',
      options: YES_NO_JNSPR_FILTERS,
      showLabel: true,
    },
    {
      id: 'resources',
      name: 'resources',
      component: 'select-simple',
      options: CANDIDATE_RESOURCES_FILTERS,
      title: 'Quelle sont vos sources de revenu ?',
      showLabel: true,
    },
    {
      id: 'jobSearchDuration',
      name: 'jobSearchDuration',
      title: "Depuis combien de temps êtes-vous en recherche d'emploi ?",
      component: 'select-simple',
      options: JOB_SEARCH_DURATIONS_FILTERS,
      showLabel: true,
    },
    {
      id: 'studiesLevel',
      name: 'studiesLevel',
      title: 'Quel est votre niveau d’études ?',
      component: 'select-simple',
      options: STUDIES_LEVELS_FILTERS,
      showLabel: true,
    },
    {
      id: 'workingExperience',
      name: 'workingExperience',
      title: "Nombre d'année d'expérience professionnelle",
      component: 'select-simple',
      options: WORKING_EXPERIENCE_FILTERS,
      showLabel: true,
    },
  ],
};
