import React from 'react';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from '@/src/components/backoffice/parameters/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { FlattenedOnboardingFormData } from '../../Onboarding.types';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { formOnboardingCandidateJob } from './schemas/formOnboardingCandidateJob';
import { formOnboardingCoachJob } from './schemas/formOnboardingCoachJob';

interface OnboardingJobFormProps {
  onSubmit: (values: Partial<FlattenedOnboardingFormData>) => void;
  onBeforeStep: () => void;
}

export const OnboardingJobForm = ({
  onSubmit,
  onBeforeStep,
}: OnboardingJobFormProps) => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);
  const { userProfile } = user;

  return (
    <FormWithValidation
      formSchema={
        contextualRole === UserRoles.CANDIDATE
          ? formOnboardingCandidateJob
          : formOnboardingCoachJob
      }
      onSubmit={onSubmit}
      submitText="Suivant"
      cancelText="Précédent"
      onCancel={onBeforeStep}
      defaultValues={
        contextualRole === UserRoles.CANDIDATE
          ? getCandidateDefaultProfessionalValues(userProfile)
          : getCoachDefaultProfessionalValues(userProfile)
      }
    />
  );
};
