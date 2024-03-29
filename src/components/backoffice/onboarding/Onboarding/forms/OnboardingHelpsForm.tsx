import React from 'react';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { formOnboardingCandidateHelps } from './schemas/formOnboardingCandidateHelps';
import { formOnboardingCoachHelps } from './schemas/formOnboardingCoachHelps';
import { FlattenedOnboardingFormData } from '../../Onboarding.types';

interface OnboardingHelpsForm {
    onSubmit: (fields: Partial<FlattenedOnboardingFormData>) => void;
}

export const OnboardingHelpsForm = ({ onSubmit }: OnboardingHelpsForm) => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);
  const { userProfile } = user;
  const helpField = useHelpField(contextualRole);
  if (!contextualRole || !helpField) return null;
  return (
    <FormWithValidation
      formSchema={
        contextualRole === USER_ROLES.CANDIDATE
          ? formOnboardingCandidateHelps
          : formOnboardingCoachHelps
      }
      onSubmit={onSubmit}
      defaultValues={{
        [helpField]: userProfile[helpField].map(({ name }) => name) || [],
      }}
      submitText="Suivant"
    />
  );
};
