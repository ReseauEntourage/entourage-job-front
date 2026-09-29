// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  getPresentationGenerationLabels,
  getPresentationGenerationPhase,
  hasParcours,
  PRESENTATION_GENERATION_TIMEOUT_MS,
} from './presentationGeneration.utils';

const START = 1_000_000;

const phase = (
  generation: Parameters<
    typeof getPresentationGenerationPhase
  >[0]['generation'],
  overrides: Partial<Parameters<typeof getPresentationGenerationPhase>[0]> = {}
) =>
  getPresentationGenerationPhase({
    generation,
    abandonedRequestId: null,
    hadPresentationOnArrival: false,
    now: START + 1_000,
    ...overrides,
  });

describe('getPresentationGenerationPhase', () => {
  it('is idle when no generation was launched', () => {
    expect(phase({ status: 'uninitialized' })).toBe('idle');
  });

  it('is idle when a presentation already existed on arrival', () => {
    expect(
      phase(
        { status: 'pending', requestId: 'r1', startedTimeStamp: START },
        { hadPresentationOnArrival: true }
      )
    ).toBe('idle');
  });

  it('is generating while pending before the deadline', () => {
    expect(
      phase({ status: 'pending', requestId: 'r1', startedTimeStamp: START })
    ).toBe('generating');
  });

  it('fails once the 10 s deadline has passed while pending', () => {
    expect(
      phase(
        { status: 'pending', requestId: 'r1', startedTimeStamp: START },
        { now: START + PRESENTATION_GENERATION_TIMEOUT_MS }
      )
    ).toBe('failed');
  });

  it('is proposed when a text arrived in time', () => {
    expect(
      phase({
        status: 'fulfilled',
        requestId: 'r1',
        startedTimeStamp: START,
        fulfilledTimeStamp: START + 3_000,
        description: 'Je travaille dans la logistique.',
      })
    ).toBe('proposed');
  });

  it('ignores a text that arrived after the deadline', () => {
    expect(
      phase({
        status: 'fulfilled',
        requestId: 'r1',
        startedTimeStamp: START,
        fulfilledTimeStamp: START + PRESENTATION_GENERATION_TIMEOUT_MS + 1,
        description: 'Trop tard.',
      })
    ).toBe('failed');
  });

  it('fails on a null description or a rejected request', () => {
    expect(
      phase({
        status: 'fulfilled',
        requestId: 'r1',
        startedTimeStamp: START,
        fulfilledTimeStamp: START + 1_000,
        description: null,
      })
    ).toBe('failed');
    expect(
      phase({ status: 'rejected', requestId: 'r1', startedTimeStamp: START })
    ).toBe('failed');
  });

  it('is idle for an abandoned generation, even once its text arrives', () => {
    expect(
      phase(
        {
          status: 'fulfilled',
          requestId: 'r1',
          startedTimeStamp: START,
          fulfilledTimeStamp: START + 1_000,
          description: 'Texte arrivé après « Écrire moi-même ».',
        },
        { abandonedRequestId: 'r1' }
      )
    ).toBe('idle');
  });

  it('does not apply an older abandon to a new generation', () => {
    expect(
      phase(
        { status: 'pending', requestId: 'r2', startedTimeStamp: START },
        { abandonedRequestId: 'r1' }
      )
    ).toBe('generating');
  });
});

describe('hasParcours', () => {
  it('is true with at least one experience or formation', () => {
    expect(hasParcours({ experiences: [{}], formations: [] })).toBe(true);
    expect(hasParcours({ experiences: [], formations: [{}] })).toBe(true);
    expect(hasParcours({ experiences: [], formations: [] })).toBe(false);
    expect(hasParcours(null)).toBe(false);
  });
});

describe('getPresentationGenerationLabels', () => {
  it('uses the validated labels and the "parcours" / "réponses" variant', () => {
    expect(getPresentationGenerationLabels(true).aiNotice).toBe(
      "Texte proposé par une IA (Claude, d'Anthropic) à partir de votre parcours. Relisez-le et modifiez-le si besoin."
    );
    expect(getPresentationGenerationLabels(false).pending).toBe(
      'Nous rédigeons une proposition à partir de vos réponses…'
    );
    expect(getPresentationGenerationLabels(true).writeMyself).toBe(
      'Écrire moi-même'
    );
  });
});
