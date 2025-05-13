import { DefaultValues } from 'react-hook-form';
import {
  BusinessSector,
  UserProfile,
  UserProfileSectorOccupation,
} from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { UserRoles } from 'src/constants/users';

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
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCoachProfessionalInformation>
> => {
  const { sectorOccupations, currentJob, linkedinUrl } = userProfileParam;

  const sortedSectorOccupations = sectorOccupations?.sort(
    (so1, so2) => so1.order - so2.order
  );
  const sortedSectorOccupationsWithSector = sortedSectorOccupations?.filter(
    (so) => !!so.businessSector
  );
  const businessSectors = sortedSectorOccupationsWithSector?.map(
    ({ businessSector }) => businessSector
  ) as BusinessSector[];
  return {
    currentJob: currentJob || undefined,
    ...businessSectors?.map((businessSector, idx) => {
      return {
        [`businessSectorId${idx}`]: businessSector.id,
      };
    }, {}),
    linkedinUrl: linkedinUrl || undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { linkedinUrl, sectorOccupations } = userProfileParam;

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
    linkedinUrl: linkedinUrl || undefined,
  };
  return data;
};
