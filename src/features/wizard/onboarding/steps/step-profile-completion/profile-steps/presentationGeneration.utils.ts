export const PRESENTATION_MAX_LENGTH = 500;

// Counted from the launch of the generation (skills step validation, or
// arrival on the presentation step after a reload).
export const PRESENTATION_GENERATION_TIMEOUT_MS = 10_000;

/**
 * - generating: the field is hidden behind the waiting component;
 * - proposed: the field shows the AI text, with the AI notice below;
 * - failed: the field is empty, with the invitation message below;
 * - idle: the plain field (existing presentation, or user chose to write).
 */
export type PresentationGenerationPhase =
  'generating' | 'proposed' | 'failed' | 'idle';

interface GenerationState {
  status: 'uninitialized' | 'pending' | 'fulfilled' | 'rejected';
  requestId?: string;
  startedTimeStamp?: number;
  fulfilledTimeStamp?: number;
  description?: string | null;
}

interface PhaseParams {
  generation: GenerationState;
  // Generation already used or given up on (the user left the step, or chose
  // to write): its result must never be inserted again.
  abandonedRequestId: string | null;
  now: number;
}

export const getPresentationGenerationPhase = ({
  generation,
  abandonedRequestId,
  now,
}: PhaseParams): PresentationGenerationPhase => {
  const { status, requestId, startedTimeStamp, fulfilledTimeStamp } =
    generation;

  if (
    status === 'uninitialized' ||
    (requestId && requestId === abandonedRequestId)
  ) {
    return 'idle';
  }

  const deadline =
    (startedTimeStamp ?? now) + PRESENTATION_GENERATION_TIMEOUT_MS;

  if (status === 'pending') {
    return now < deadline ? 'generating' : 'failed';
  }

  if (status === 'rejected') {
    return 'failed';
  }

  const arrivedInTime =
    fulfilledTimeStamp !== undefined && fulfilledTimeStamp <= deadline;
  return arrivedInTime && generation.description?.trim()
    ? 'proposed'
    : 'failed';
};

export const hasParcours = (
  profile:
    | { experiences?: unknown[] | null; formations?: unknown[] | null }
    | null
    | undefined
) =>
  (profile?.experiences?.length ?? 0) > 0 ||
  (profile?.formations?.length ?? 0) > 0;

// Labels validated by the PM on EN-9628.
export const getPresentationGenerationLabels = (withParcours: boolean) => {
  const source = withParcours ? 'votre parcours' : 'vos réponses';
  return {
    pending: `Nous rédigeons une proposition à partir de ${source}…`,
    writeMyself: 'Écrire moi-même',
    aiNotice: `Texte proposé par une IA (Claude, d'Anthropic) à partir de ${source}. Relisez-le et modifiez-le si besoin.`,
    invitation:
      'Présentez-vous en quelques lignes : votre parcours, ce que vous recherchez ou ce que vous pouvez apporter.',
  };
};
