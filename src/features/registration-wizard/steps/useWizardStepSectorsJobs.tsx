import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { FilterConstant } from '@/src/constants/utils';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { StyledTwoColumns } from '@/src/features/registration-wizard/onboarding/steps/step-profile-completion/components/ProfessionalInfoAccordion/ProfesionalInfoAccordion.styles';
import { ProfileCompletionSchemaField } from '@/src/features/registration-wizard/onboarding/steps/step-profile-completion/components/ProfileCompletionSchemaField';
import {
  profileCompletionFormSchema,
  profileCompletionProfessionalInfoCandidateRows,
  profileCompletionProfessionalInfoCoachFields,
} from '@/src/features/registration-wizard/onboarding/steps/step-profile-completion/profileCompletionFormSchema';
import { ProfileCompletionFormValues } from '@/src/features/registration-wizard/onboarding/steps/step-profile-completion/types';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationCurrentStep,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';
import { formatCareerPathSentence } from '@/src/utils/Formatting';

const businessSectorIdsField =
  profileCompletionProfessionalInfoCoachFields.find(
    (f) => f.id === 'businessSectorIds'
  )!;

function CandidateContent() {
  return (
    <>
      {profileCompletionProfessionalInfoCandidateRows.map((row) => (
        <StyledTwoColumns key={row.rowIndex}>
          {row.fields.map((field) => (
            <ProfileCompletionSchemaField
              key={String(field.name)}
              formSchema={profileCompletionFormSchema}
              field={field}
              showError={false}
            />
          ))}
        </StyledTwoColumns>
      ))}
    </>
  );
}

function CoachContent() {
  return (
    <ProfileCompletionSchemaField
      formSchema={profileCompletionFormSchema}
      field={businessSectorIdsField}
      showError={false}
    />
  );
}

export function useWizardStepSectorsJobs() {
  const dispatch = useDispatch();
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const userRole = selectedFlow
    ? UserRoleByFlow[selectedFlow]
    : UserRoles.CANDIDATE;

  const isCandidate = userRole === UserRoles.CANDIDATE;

  const formMethods = useForm<ProfileCompletionFormValues>({
    defaultValues: {
      businessSectorId0: null,
      occupation0: '',
      businessSectorId1: null,
      occupation1: '',
      businessSectorIds: [],
    },
    mode: 'onChange',
  });

  const content = useMemo(
    () => (
      <FormProvider {...formMethods}>
        {isCandidate ? <CandidateContent /> : <CoachContent />}
      </FormProvider>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCandidate]
  );

  const step: WizardStep = {
    smallTitle: isCandidate ? 'Secteurs recherchés' : 'Vos secteurs',
    summary: {
      title: isCandidate
        ? 'Vos secteurs et métiers recherchés'
        : 'Vos secteurs',
      description: isCandidate
        ? 'Indiquez les secteurs et métiers qui vous intéressent'
        : 'Indiquez les secteurs dans lesquels vous avez du réseau',
      duration: '~1 minute',
    },
    hideGenericStepHeader: undefined,
    title: isCandidate
      ? 'Quels secteurs et métiers vous intéressent ?'
      : 'Dans quels secteurs avez-vous du réseau ?',
    description: isCandidate
      ? 'Ces informations nous permettront de vous proposer des coachs dans votre domaine'
      : 'Ces informations nous permettront de vous mettre en relation avec les bons candidats',
    content,
    isNextEnabled: formMethods.formState.isValid,
    onSubmit: async () => {
      const values = formMethods.getValues();
      let sectorOccupations: UserProfileSectorOccupation[];

      if (isCandidate) {
        sectorOccupations = formatCareerPathSentence({
          businessSectorId0: values.businessSectorId0 ?? undefined,
          occupation0: values.occupation0,
          businessSectorId1: values.businessSectorId1 ?? undefined,
          occupation1: values.occupation1,
        });
      } else {
        sectorOccupations = (
          values.businessSectorIds as FilterConstant<string>[]
        ).map(
          (s, idx) =>
            ({
              businessSectorId: s.value,
              order: idx,
            } as UserProfileSectorOccupation)
        );
      }

      dispatch(
        registrationActions.setPreRegistrationPreferences({ sectorOccupations })
      );
      dispatch(
        registrationActions.moveForwardInRegistration({ step: currentStep + 1 })
      );
    },
    section: 'inscription',
  };

  return { step };
}
