import { DefaultValues } from 'react-hook-form';
import {
  Company,
  UserProfile,
  UserProfileSectorOccupation,
} from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from '@/src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from '@/src/components/forms/schemas/formEditCoachProfessionalInformation';
import { UserRoles } from '@/src/constants/users';
import { formOnboardingCoachJob } from '../../../onboarding/Onboarding/forms/schemas/formOnboardingCoachJob';

interface userProfileParamsToCheck {
  currentJob: string | null;
  sectorOccupations: UserProfileSectorOccupation[] | null;
  role: UserRoles;
}

export const checkData = (userProfile: userProfileParamsToCheck): boolean => {
  const gotOccupation = !!userProfile.sectorOccupations?.some(
    (so) => !!so.occupation
  );
  const gotBusinessSector = !!userProfile.sectorOccupations?.some(
    (so) => !!so.businessSector
  );
  return gotBusinessSector || gotOccupation;
};

export const getCoachDefaultProfessionalValues = (
  userProfileParam: UserProfile,
  company: Company | null
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCoachProfessionalInformation>
> => {
  const { sectorOccupations, currentJob } = userProfileParam;

  const businessSectors = sectorOccupations
    ? sectorOccupations
        .filter((so) => so.businessSector)
        .map(({ businessSector }) => businessSector)
    : [];
  return {
    currentJob: currentJob || undefined,
    businessSectorIds: businessSectors?.map((businessSector) => ({
      value: businessSector?.id,
      label: businessSector?.name,
    })),
    companyId: company
      ? {
          value: company.id,
          label: company.name,
        }
      : undefined,
  };
};

export const getCoachDefaultProfessionalValuesWithLinkedIn = (
  userProfileParam: UserProfile,
  company: Company | null
): DefaultValues<
  ExtractFormSchemaValidation<typeof formOnboardingCoachJob>
> => {
  const { linkedinUrl } = userProfileParam;

  const professionalInfoDefaultValues = getCoachDefaultProfessionalValues(
    userProfileParam,
    company
  );

  return {
    ...professionalInfoDefaultValues,
    linkedinUrl: linkedinUrl || undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { sectorOccupations } = userProfileParam;

  const businessSectors = sectorOccupations
    ? sectorOccupations
        .filter((so) => so.businessSector)
        .map(({ businessSector }) => businessSector)
    : [];
  const occupations = sectorOccupations
    ? sectorOccupations
        ?.filter((so) => so.occupation)
        .map(({ occupation }) => occupation)
    : [];

  const data = {
    ...businessSectors?.reduce((acc, businessSector, idx) => {
      acc[`businessSectorId${idx}`] = {
        value: businessSector?.id,
        label: businessSector?.name,
      };
      return acc;
    }, {}),
    ...occupations?.reduce((acc, occupation, idx) => {
      acc[`occupation${idx}`] = occupation?.name;
      return acc;
    }, {}),
  };
  return data;
};
