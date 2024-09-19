import { UserProfile } from 'src/api/types';
import {
  formatCareerPathSentence,
  formatNetworkBusinessLines,
} from 'src/utils';
import { FlattenedOnboardingFormData } from './Onboarding.types';

export const parseOnboadingProfileFields = (
  fields: Partial<FlattenedOnboardingFormData>
): Partial<UserProfile> => {
  return {
    description: fields.description ? fields.description : undefined,
    searchAmbitions: fields.searchBusinessLine0
      ? formatCareerPathSentence(fields).searchAmbitions
      : undefined,
    searchBusinessLines: fields.searchBusinessLine0
      ? formatCareerPathSentence(fields).searchBusinessLines
      : undefined,
    currentJob: fields.currentJob ? fields.currentJob : undefined,
    networkBusinessLines: fields.networkBusinessLines
      ? formatNetworkBusinessLines(fields.networkBusinessLines)
      : undefined,
    helpNeeds: fields.helpNeeds?.map((help) => {
      return { name: help };
    }),
    helpOffers: fields.helpOffers?.map((help) => {
      return { name: help };
    }),
    linkedinUrl: fields.linkedinUrl ? fields.linkedinUrl : undefined,
  };
};
