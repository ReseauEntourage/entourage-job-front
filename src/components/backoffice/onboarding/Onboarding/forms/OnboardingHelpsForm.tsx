import React from 'react';
import { FlattenedOnboardingFormData } from '../../Onboarding.types';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { formOnboardingCandidateHelps } from './schemas/formOnboardingCandidateHelps';
import { formOnboardingCoachHelps } from './schemas/formOnboardingCoachHelps';

interface OnboardingHelpsFormProps {
  onSubmit: (fields: Partial<FlattenedOnboardingFormData>) => void;
}

export const OnboardingHelpsForm = ({ onSubmit }: OnboardingHelpsFormProps) => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);
  const { userProfile } = user;
  const helpField = useHelpField(contextualRole);
  if (!helpField) return null;
  return (
    <FormWithValidation
      formSchema={
        contextualRole === UserRoles.CANDIDATE
          ? formOnboardingCandidateHelps
          : formOnboardingCoachHelps
      }
      onSubmit={onSubmit}
      defaultValues={{
        [helpField]: userProfile[helpField]?.map(({ name }) => name) || [],
      }}
      submitText="Suivant"
    />
  );
};
