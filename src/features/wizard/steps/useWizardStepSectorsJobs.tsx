import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { Card } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { FilterConstant } from '@/src/constants/utils';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { FormWithValidationSync } from '@/src/features/wizard/FormWithValidationSync';
import {
  coachCurrentJobField,
  PROFILE_COMPLETION_FORM_ID,
  profileCompletionProfessionalInfoCandidateRows,
  profileCompletionProfessionalInfoCoachFields,
} from '@/src/features/wizard/onboarding/steps/step-profile-completion/profileCompletionFormSchema';
import { ProfileCompletionFormValues } from '@/src/features/wizard/onboarding/steps/step-profile-completion/types';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { WizardCompatibleProfilesSidePanel } from '@/src/features/wizard/sidepanels/WizardCompatibleProfilesSidePanel';
import { useStepFormSubmit } from '@/src/features/wizard/useStepFormSubmit';
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

const candidateFields = profileCompletionProfessionalInfoCandidateRows.flatMap(
  (row) => row.fields
);
const coachFields = [coachCurrentJobField, businessSectorIdsField];

type SectorsJobsValues = Partial<ProfileCompletionFormValues>;

const isCandidateFormValid = (values: SectorsJobsValues) =>
  !!values.businessSectorId0 &&
  (!!values.businessSectorId1 || !values.occupation1);

const isCoachFormValid = (values: SectorsJobsValues) => {
  const sectors = values.businessSectorIds as
    | FilterConstant<string>[]
    | undefined;
  return !!values.currentJob && Array.isArray(sectors) && sectors.length > 0;
};

const buildPreferences = (isCandidate: boolean, values: SectorsJobsValues) => {
  let sectorOccupations: UserProfileSectorOccupation[];
  let businessSectorIds: string[];

  if (isCandidate) {
    sectorOccupations = formatCareerPathSentence({
      businessSectorId0: values.businessSectorId0 ?? undefined,
      occupation0: values.occupation0 ?? '',
      businessSectorId1: values.businessSectorId1 ?? undefined,
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

  return {
    sectorOccupations,
    businessSectorIds,
    ...(!isCandidate && { currentJob: values.currentJob ?? '' }),
  };
};

export function useWizardStepSectorsJobs() {
  const dispatch = useDispatch();
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const userRole = selectedFlow
    ? UserRoleByFlow[selectedFlow]
    : UserRoles.CANDIDATE;

  const isCandidate = userRole === UserRoles.CANDIDATE;
  const formRef = useRef<FormWithValidationRef>(null);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // Le formulaire remonte (key candidate/coach) au changement de rôle : la valeur
  // précédente ne doit pas rester affichée pendant le remontage.
  useEffect(() => {
    setIsNextEnabled(false);
  }, [isCandidate]);

  const sidePanelContent = useCallback(
    (mode: 'compact' | 'full') => (
      <WizardCompatibleProfilesSidePanel
        mode={mode}
        subtitleContext="sectors"
      />
    ),
    []
  );

  const sectorsJobsFormSchema = useMemo(
    () => ({
      id: PROFILE_COMPLETION_FORM_ID,
      fields: isCandidate ? candidateFields : coachFields,
    }),
    [isCandidate]
  );

  const defaultValues = useMemo<SectorsJobsValues>(
    () => ({
      businessSectorId0: null,
      occupation0: '',
      businessSectorId1: null,
      occupation1: '',
      businessSectorIds: [],
      currentJob: '',
    }),
    []
  );

  // Pousse chaque changement vers les préférences d'inscription pour alimenter
  // le side panel de profils compatibles en direct, et recalcule isNextEnabled.
  const handleWatch = useCallback(
    (values: SectorsJobsValues) => {
      dispatch(
        registrationActions.setPreRegistrationPreferences(
          buildPreferences(isCandidate, values)
        )
      );
      setIsNextEnabled(
        isCandidate ? isCandidateFormValid(values) : isCoachFormValid(values)
      );
    },
    [dispatch, isCandidate]
  );

  const handleFormWithValidationSubmit = useCallback(
    (values: SectorsJobsValues) => {
      dispatch(
        registrationActions.setPreRegistrationPreferences(
          buildPreferences(isCandidate, values)
        )
      );
      dispatch(
        registrationActions.moveForwardInRegistration({
          step: currentStep + 1,
        })
      );
    },
    [dispatch, isCandidate, currentStep]
  );

  const step: WizardStep = {
    id: 'sectors-jobs',
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
    content: (
      <Card title="Ce que vous recherchez">
        <FormWithValidationSync
          key={isCandidate ? 'candidate' : 'coach'}
          formSchema={sectorsJobsFormSchema}
          defaultValues={defaultValues}
          onSubmit={handleFormWithValidationSubmit}
          onWatch={handleWatch}
          formRef={formRef}
        />
      </Card>
    ),
    sidePanelContent,
    mobileBottomSheet: true,
    isNextEnabled,
    onSubmit: useStepFormSubmit(formRef),
    section: 'inscription',
  };

  return { step };
}
