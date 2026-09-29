import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { FormSchema } from '@/src/features/forms/FormSchema';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import { FormWithValidationSync } from '@/src/features/wizard/FormWithValidationSync';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import {
  currentUserActions,
  GENERATE_PRESENTATION_FIXED_CACHE_KEY,
  useGeneratePresentationMutation,
} from '@/src/use-cases/current-user';
import {
  onboardingActions,
  selectAbandonedPresentationGenerationId,
} from '@/src/use-cases/onboarding';
import type { AnyCantFix } from '@/src/utils/Types';
import { PresentationGenerationPending } from './PresentationGenerationPending';
import {
  getPresentationGenerationLabels,
  getPresentationGenerationPhase,
  hasParcours,
  PRESENTATION_GENERATION_TIMEOUT_MS,
} from './presentationGeneration.utils';

export interface PresentationFormValues {
  description: string;
}

interface StepPresentationContentProps {
  formSchema: FormSchema<AnyCantFix>;
  formRef: RefObject<FormWithValidationRef | null>;
  onSubmit: (values: PresentationFormValues) => Promise<void>;
  onWatch: (values: PresentationFormValues) => void;
}

// Rendered only while the presentation step is displayed: arrival, leaving
// and the 10 s deadline are all tied to this component's lifecycle.
export const StepPresentationContent = ({
  formSchema,
  formRef,
  onSubmit,
  onWatch,
}: StepPresentationContentProps) => {
  const dispatch = useDispatch();
  const profileComplete = useCurrentUserProfileComplete();
  const [generatePresentation, generation] = useGeneratePresentationMutation({
    fixedCacheKey: GENERATE_PRESENTATION_FIXED_CACHE_KEY,
  });
  const abandonedRequestId = useSelector(
    selectAbandonedPresentationGenerationId
  );

  // Snapshot taken once the profile is known: with a presentation already
  // there on arrival, no generation is launched from this step.
  const [hadPresentationOnArrival, setHadPresentationOnArrival] = useState<
    boolean | null
  >(profileComplete ? !!profileComplete.description?.trim() : null);
  useEffect(() => {
    if (hadPresentationOnArrival === null && profileComplete) {
      setHadPresentationOnArrival(!!profileComplete.description?.trim());
    }
  }, [hadPresentationOnArrival, profileComplete]);

  // Arrival without any generation since page load (e.g. after a reload on
  // this step): launch it now.
  useEffect(() => {
    if (hadPresentationOnArrival === false && generation.isUninitialized) {
      generatePresentation();
    }
  }, [
    hadPresentationOnArrival,
    generation.isUninitialized,
    generatePresentation,
  ]);

  const [now, setNow] = useState(() => Date.now());
  const phase =
    hadPresentationOnArrival === null
      ? 'idle'
      : getPresentationGenerationPhase({
          generation: {
            status: generation.status,
            requestId: generation.requestId,
            startedTimeStamp: generation.startedTimeStamp,
            fulfilledTimeStamp: generation.fulfilledTimeStamp,
            description: generation.data?.description,
          },
          abandonedRequestId,
          now,
        });

  // Re-render at the deadline so a slow generation turns into a failure.
  useEffect(() => {
    if (phase !== 'generating' || !generation.startedTimeStamp) {
      return;
    }
    const remaining =
      generation.startedTimeStamp +
      PRESENTATION_GENERATION_TIMEOUT_MS -
      Date.now();
    const timeout = setTimeout(
      () => setNow(Date.now()),
      Math.max(remaining, 0) + 10
    );
    return () => clearTimeout(timeout);
  }, [phase, generation.startedTimeStamp]);

  const proposedDescription =
    phase === 'proposed' ? (generation.data?.description ?? '') : null;

  // Latest value of the field once a proposal is shown (the proposal itself,
  // then the user's edits).
  const fieldValueRef = useRef<string | null>(null);
  useEffect(() => {
    if (proposedDescription !== null) {
      fieldValueRef.current = proposedDescription;
    }
  }, [proposedDescription]);
  const handleWatch = useCallback(
    (values: PresentationFormValues) => {
      fieldValueRef.current = values.description;
      onWatch(values);
    },
    [onWatch]
  );

  // Reflect the field in the live profile preview. Saving the skills step
  // refreshes the profile from the server, and that response can land after
  // the proposal: re-apply the field value whenever the stored draft drifts.
  const storedDescription = profileComplete?.description ?? null;
  useEffect(() => {
    const fieldValue = fieldValueRef.current;
    if (
      phase === 'proposed' &&
      fieldValue !== null &&
      storedDescription !== fieldValue
    ) {
      dispatch(
        currentUserActions.profileCompleteDraftUpdated({
          description: fieldValue,
        })
      );
    }
  }, [dispatch, phase, storedDescription, proposedDescription]);

  // Leaving the step (including "Terminer mon profil") uses up the current
  // generation, whatever its state: coming back shows the profile as it is,
  // and only a new validation of the skills step brings a new proposal.
  const latestRequestIdRef = useRef(generation.requestId);
  latestRequestIdRef.current = generation.requestId;
  useEffect(
    () => () => {
      const requestId = latestRequestIdRef.current;
      if (requestId) {
        dispatch(onboardingActions.presentationGenerationAbandoned(requestId));
      }
    },
    [dispatch]
  );

  const labels = getPresentationGenerationLabels(hasParcours(profileComplete));

  if (phase === 'generating') {
    return (
      <PresentationGenerationPending
        text={labels.pending}
        writeMyselfLabel={labels.writeMyself}
        onWriteMyself={() => {
          if (generation.requestId) {
            dispatch(
              onboardingActions.presentationGenerationAbandoned(
                generation.requestId
              )
            );
          }
        }}
      />
    );
  }

  return (
    <>
      <FormWithValidationSync
        // FormWithValidation only reads its defaultValues on mount: the key
        // remounts it once the profile is loaded and when the proposal lands.
        key={`${profileComplete ? 'loaded' : 'pending'}-${phase}`}
        formSchema={formSchema}
        defaultValues={{
          description:
            proposedDescription ?? profileComplete?.description ?? '',
        }}
        onSubmit={onSubmit}
        onWatch={handleWatch}
        formRef={formRef}
      />
      {phase === 'proposed' && (
        <Text size="small" color="darkGray">
          {labels.aiNotice}
        </Text>
      )}
      {phase === 'failed' && <Text size="small">{labels.invitation}</Text>}
    </>
  );
};
