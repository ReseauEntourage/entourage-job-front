import {
  CandidateAccommodation,
  CandidateResource,
  JobSearchDuration,
  Nationality,
  StudiesLevel,
  WorkingExperience,
  YesNoJNSPRValue,
} from '@/src/constants';

export interface SocialSituationFormValues {
  nationality: Nationality;
  accommodation: CandidateAccommodation;
  hasSocialWorker: YesNoJNSPRValue;
  resources: CandidateResource;
  jobSearchDuration: JobSearchDuration;
  studiesLevel: StudiesLevel;
  workingExperience: WorkingExperience;
}
