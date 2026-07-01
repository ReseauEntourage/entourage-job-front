import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { Card } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { FilterConstant } from '@/src/constants/utils';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { ProfileCompletionSchemaField } from '@/src/features/wizard/onboarding/steps/step-profile-completion/components/ProfileCompletionSchemaField';
import {
  coachCurrentJobField,
  profileCompletionFormSchema,
  profileCompletionProfessionalInfoCandidateRows,
  profileCompletionProfessionalInfoCoachFields,
} from '@/src/features/wizard/onboarding/steps/step-profile-completion/profileCompletionFormSchema';
import { ProfileCompletionFormValues } from '@/src/features/wizard/onboarding/steps/step-profile-completion/types';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { WizardCompatibleProfilesSidePanel } from '@/src/features/wizard/sidepanels/WizardCompatibleProfilesSidePanel';
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
      {profileCompletionProfessionalInfoCandidateRows.map((row) =>
        row.fields.map((field) => (
          <ProfileCompletionSchemaField
            key={String(field.name)}
            formSchema={profileCompletionFormSchema}
            field={field}
            showError={false}
          />
        ))
      )}
    </>
  );
}

function CoachContent() {
  return (
    <>
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={coachCurrentJobField}
        showError={false}
      />
      <ProfileCompletionSchemaField
        formSchema={profileCompletionFormSchema}
        field={businessSectorIdsField}
        showError={false}
      />
    </>
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

  const sidePanelContent = useCallback(
    (mode: 'compact' | 'full') => (
      <WizardCompatibleProfilesSidePanel
        mode={mode}
        subtitleContext="sectors"
      />
    ),
    []
  );

  const formMethods = useForm<ProfileCompletionFormValues>({
    defaultValues: {
      businessSectorId0: null,
      occupation0: '',
      businessSectorId1: null,
      occupation1: '',
      businessSectorIds: [],
      currentJob: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      let sectorOccupations: UserProfileSectorOccupation[];
      let businessSectorIds: string[];

      if (isCandidate) {
        sectorOccupations = formatCareerPathSentence({
          businessSectorId0: values.businessSectorId0 as
            | FilterConstant<string>
            | undefined,
          occupation0: values.occupation0 ?? '',
          businessSectorId1: values.businessSectorId1 as
            | FilterConstant<string>
            | undefined,
          occupation1: values.occupation1 ?? '',
        });
        businessSectorIds = [
          values.businessSectorId0?.value,
          values.businessSectorId1?.value,
        ].filter((id): id is string => Boolean(id));
      } else {
        const sectors = (values.businessSectorIds ??
          []) as FilterConstant<string>[];
        sectorOccupations = sectors.map(
          (s, idx) =>
            ({
              businessSectorId: s.value,
              order: idx,
            } as UserProfileSectorOccupation)
        );
        businessSectorIds = sectors
          .map((s) => s.value)
          .filter((id): id is string => Boolean(id));
      }

      dispatch(
        registrationActions.setPreRegistrationPreferences({
          sectorOccupations,
          businessSectorIds,
          ...(!isCandidate && { currentJob: values.currentJob ?? '' }),
        })
      );
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCandidate]);

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
      ? 'Quel métier(s) et secteur(s) visez-vous ?'
      : 'Quel est votre métier, et dans quels secteurs avez-vous du réseau ?',
    description: isCandidate
      ? 'Pour trouver des coachs qui connaissent votre domaine.'
      : 'Pour vous montrer des personnes qui cherchent justement dans votre domaine.',
    content: <Card title="Ce que vous recherchez">{content}</Card>,
    sidePanelContent,
    mobileBottomSheet: true,
    isNextEnabled: formMethods.formState.isValid,
    onSubmit: async () => {
      const values = formMethods.getValues();
      let sectorOccupations: UserProfileSectorOccupation[];
      let businessSectorIds: string[];

      if (isCandidate) {
        sectorOccupations = formatCareerPathSentence({
          businessSectorId0: values.businessSectorId0 ?? undefined,
          occupation0: values.occupation0,
          businessSectorId1: values.businessSectorId1 ?? undefined,
          occupation1: values.occupation1,
        });
        businessSectorIds = [
          values.businessSectorId0?.value,
          values.businessSectorId1?.value,
        ].filter((id): id is string => Boolean(id));
      } else {
        const sectors = values.businessSectorIds as FilterConstant<string>[];
        sectorOccupations = sectors.map(
          (s, idx) =>
            ({
              businessSectorId: s.value,
              order: idx,
            } as UserProfileSectorOccupation)
        );
        businessSectorIds = sectors
          .map((s) => s.value)
          .filter((id): id is string => Boolean(id));
      }

      dispatch(
        registrationActions.setPreRegistrationPreferences({
          sectorOccupations,
          businessSectorIds,
          ...(!isCandidate && { currentJob: values.currentJob ?? '' }),
        })
      );
      dispatch(
        registrationActions.moveForwardInRegistration({ step: currentStep + 1 })
      );
    },
    section: 'inscription',
  };

  return { step };
}
