import { DefaultValues } from 'react-hook-form';
import { PublicProfile, UserProfile } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { BUSINESS_LINES } from 'src/constants';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { findConstantFromValue, isRoleIncluded, sortByOrder } from 'src/utils';

export const checkData = (
  userProfile: UserProfile | PublicProfile,
  role: UserRole
): boolean => {
  return (
    (role === USER_ROLES.COACH &&
      (!!userProfile?.currentJob ||
        userProfile?.networkBusinessLines?.length > 0)) ||
    (isRoleIncluded(
      [USER_ROLES.CANDIDATE, USER_ROLES.CANDIDATE_EXTERNAL],
      role
    ) &&
      (userProfile?.searchAmbitions?.length > 0 ||
        userProfile?.searchBusinessLines?.length > 0))
  );
};

export const getCoachDefaultValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCoachProfessionalInformation>
> => {
  const { networkBusinessLines, currentJob } = userProfileParam;
  return {
    currentJob,
    networkBusinessLines: networkBusinessLines?.map(({ name }) => {
      return findConstantFromValue(name, BUSINESS_LINES);
    }),
  };
};

export const getCandidateDefaultValues = (
  userProfileParam: UserProfile
): DefaultValues<
  ExtractFormSchemaValidation<typeof formEditCandidateProfessionalInformation>
> => {
  const { searchAmbitions, searchBusinessLines } = userProfileParam;
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
  };
};
