import { DefaultValues } from 'react-hook-form';
import { UserProfileSectorOccupation } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/features/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from 'src/features/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/features/forms/schemas/formEditCoachProfessionalInformation';

type ProfessionalProfile = {
  sectorOccupations?: UserProfileSectorOccupation[];
  currentJob?: string | null;
};

export const getCoachDefaultProfessionalValues = (
  userProfileParam: ProfessionalProfile,
  company: { name: string } | null
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
    companyName: company
      ? {
          value: company.name,
          label: company.name,
        }
      : undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: ProfessionalProfile
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
    ...businessSectors?.reduce(
      (acc: Record<string, unknown>, businessSector, idx) => {
        acc[`businessSectorId${idx}`] = {
          value: businessSector?.id,
          label: businessSector?.name,
        };
        return acc;
      },
      {}
    ),
    ...occupations?.reduce((acc: Record<string, unknown>, occupation, idx) => {
      acc[`occupation${idx}`] = occupation?.name;
      return acc;
    }, {}),
  };
  return data;
};
