import { DefaultValues } from 'react-hook-form';
import {
  BusinessSector,
  Occupation,
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
    businessSectorIds: businessSectors?.map(({ name, id }) => {
      return {
        label: name,
        value: id,
      };
    }),
    linkedinUrl: linkedinUrl || undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { linkedinUrl, sectorOccupations } = userProfileParam;

  const sortedSectorOccupations = sectorOccupations?.sort(
    (so1, so2) => so1.order - so2.order
  );
  const sortedSectorOccupationsWithSector = sortedSectorOccupations?.filter(
    (so) => !!so.businessSector
  );
  const sortedSectorOccupationsWithOccupation = sortedSectorOccupations?.filter(
    (so) => !!so.occupation
  );
  const businessSectors = sortedSectorOccupationsWithSector?.map(
    ({ businessSector }) => businessSector
  ) as BusinessSector[];

  const occupations = sortedSectorOccupationsWithOccupation?.map(
    ({ occupation }) => occupation
  ) as Occupation[];

  return {
    ...occupations?.map((occupation, idx) => {
      return {
        [`occupation${idx}`]: occupation.name,
      };
    }, {}),
    ...businessSectors?.map((businessSector, idx) => {
      return {
        [`BusinessSector${idx}`]: businessSector.name,
      };
    }, {}),
    linkedinUrl: linkedinUrl || '',
  };
};
