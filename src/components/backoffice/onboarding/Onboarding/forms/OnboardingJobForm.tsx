import React from 'react';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from 'src/components/backoffice/parametres/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { FlattenedOnboardingFormData } from '../../Onboarding.types';
import { formOnboardingCandidateJob } from './schemas/formOnboardingCandidateJob';
import { formOnboardingCoachJob } from './schemas/formOnboardingCoachJob';

interface OnboardingJobFormProps {
    onSubmit: (values: Partial<FlattenedOnboardingFormData>) => void;
    onBeforeStep: () => void;
}

export const OnboardingJobForm = ({ onSubmit, onBeforeStep }: OnboardingJobFormProps) => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);
  const { userProfile } = user;

  if (!contextualRole) return null;

  return (
    <FormWithValidation
      formSchema={
        contextualRole === USER_ROLES.CANDIDATE
          ? formOnboardingCandidateJob
          : formOnboardingCoachJob
      }
      onSubmit={onSubmit}
      submitText="Suivant"
      cancelText="Précédent"
      onCancel={onBeforeStep}
      defaultValues={
        contextualRole === USER_ROLES.CANDIDATE
          ? getCandidateDefaultProfessionalValues(userProfile)
          : getCoachDefaultProfessionalValues(userProfile)
      }
    />
  );
};
