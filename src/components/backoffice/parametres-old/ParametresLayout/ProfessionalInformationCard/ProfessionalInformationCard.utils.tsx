import { DefaultValues } from 'react-hook-form';
import { BusinessSector, UserProfile } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { BUSINESS_SECTORS } from 'src/constants';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface userProfileParamsToCheck {
  currentJob: string | null;
  occupations: { name: string; order: number }[] | null;
  businessSectors: BusinessSector[] | null;
  role: UserRole;
}

export const checkData = (userProfile: userProfileParamsToCheck): boolean => {
  return (
    (userProfile.role === USER_ROLES.COACH &&
      (!!userProfile?.currentJob ||
        (!!userProfile?.businessSectors &&
          userProfile.businessSectors?.length > 0))) ||
    (userProfile.role === USER_ROLES.CANDIDATE &&
      ((!!userProfile?.occupations && userProfile.occupations?.length > 0) ||
        (!!userProfile?.businessSectors &&
          userProfile?.businessSectors?.length > 0)))
  );
};

export const getCoachDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCoachProfessionalInformation>
> => {
  const { businessSectors, currentJob, linkedinUrl } = userProfileParam;
  return {
    currentJob: currentJob || undefined,
    businessSectors: businessSectors?.map(({ value }) => {
      return findConstantFromValue(value, BUSINESS_SECTORS);
    }),
    linkedinUrl: linkedinUrl || undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { occupations, businessSectors, linkedinUrl } = userProfileParam;
  const sortedOccupations =
    occupations && occupations.length > 0 ? sortByOrder(occupations) : null;
  const sortedBusinessSectors =
    businessSectors && businessSectors.length > 0
      ? sortByOrder(businessSectors)
      : null;
  return {
    ...sortedOccupations?.reduce((acc, curr) => {
      return {
        ...acc,
        [`occupation${curr.order}`]: curr.name,
      };
    }, {}),
    ...sortedBusinessSectors?.reduce((acc, curr) => {
      return {
        ...acc,
        [`BusinessSector${curr.order}`]: findConstantFromValue(
          curr.value,
          BUSINESS_SECTORS
        ),
      };
    }, {}),
    linkedinUrl: linkedinUrl || '',
  };
};
