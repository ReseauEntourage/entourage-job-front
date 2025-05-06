import { DefaultValues } from 'react-hook-form';
import { UserProfile } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { BUSINESS_LINES } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface userProfileParamsToCheck {
  currentJob: string | null;
  networkBusinessLines: { name: string }[] | null;
  searchAmbitions: { name: string; order: number }[] | null;
  searchBusinessLines: { name: string; order: number }[] | null;
  role: UserRoles;
}

export const checkData = (userProfile: userProfileParamsToCheck): boolean => {
  return (
    (userProfile.role === UserRoles.COACH &&
      (!!userProfile?.currentJob ||
        (!!userProfile?.networkBusinessLines &&
          userProfile.networkBusinessLines?.length > 0))) ||
    (userProfile.role === UserRoles.CANDIDATE &&
      ((!!userProfile?.searchAmbitions &&
        userProfile.searchAmbitions?.length > 0) ||
        (!!userProfile?.searchBusinessLines &&
          userProfile?.searchBusinessLines?.length > 0)))
  );
};

export const getCoachDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCoachProfessionalInformation>
> => {
  const { networkBusinessLines, currentJob, linkedinUrl } = userProfileParam;
  return {
    currentJob: currentJob || undefined,
    networkBusinessLines: networkBusinessLines?.map(({ name }) => {
      return findConstantFromValue(name, BUSINESS_LINES);
    }),
    linkedinUrl: linkedinUrl || undefined,
  };
};

export const getCandidateDefaultProfessionalValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { searchAmbitions, searchBusinessLines, linkedinUrl } =
    userProfileParam;
  const sortedAmbitions =
    searchAmbitions && searchAmbitions.length > 0
      ? sortByOrder(searchAmbitions)
      : null;
  const sortedBusinessLines =
    searchBusinessLines && searchBusinessLines.length > 0
      ? sortByOrder(searchBusinessLines)
      : null;
  return {
    ...sortedAmbitions?.reduce((acc, curr) => {
      return {
        ...acc,
        [`searchAmbition${curr.order}`]: curr.name,
      };
    }, {}),
    ...sortedBusinessLines?.reduce((acc, curr) => {
      return {
        ...acc,
        [`searchBusinessLine${curr.order}`]: findConstantFromValue(
          curr.name,
          BUSINESS_LINES
        ),
      };
    }, {}),
    linkedinUrl: linkedinUrl || '',
  };
};
