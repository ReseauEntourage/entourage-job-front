// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import type {
  AchievementProgressionEntry,
  CriterionStat,
} from '@/src/api/types';
import { getModalMessage } from '../AchievementProgressionModal/achievement.messages';
import { formFeedback } from '../FeedbackModal/formFeedback';

const criterion = (overrides: Partial<CriterionStat>): CriterionStat =>
  ({
    key: 'conversationCount',
    label: 'Conversations',
    threshold: 5,
    currentValue: 2,
    isPercentage: false,
    ...overrides,
  }) as CriterionStat;

const entry = (criteria: CriterionStat[]): AchievementProgressionEntry =>
  ({
    type: 'super_engaged_coach',
    label: 'Super engagé',
    hasAchievement: false,
    criteria,
  }) as unknown as AchievementProgressionEntry;

describe('getModalMessage', () => {
  it('announces the badge when it was just obtained', () => {
    const message = getModalMessage(entry([]), null);
    expect(message.title).toBe('Badge "Super engagé" obtenu !');
    expect(message.subtitle).toMatch(/coachs les plus engagés/);
  });

  it('says how many exchanges remain, in the plural', () => {
    const message = getModalMessage(
      entry([criterion({ currentValue: 2, threshold: 5 })]),
      'conversationCount'
    );
    expect(message.title).toBe('Vous avez aidé 2 candidats !');
    expect(message.subtitle).toBe(
      'Plus que 3 échanges pour décrocher le badge "Super engagé" !'
    );
  });

  it('uses the singular for one remaining exchange and one helped candidate', () => {
    const message = getModalMessage(
      entry([criterion({ currentValue: 1, threshold: 2 })]),
      'conversationCount'
    );
    expect(message.title).toBe('Vous avez aidé 1 candidat !');
    expect(message.subtitle).toBe(
      'Plus qu\'un seul échange pour décrocher le badge "Super engagé" !'
    );
  });

  it('mentions the pending criteria once the count objective is reached', () => {
    const message = getModalMessage(
      entry([
        criterion({ currentValue: 5, threshold: 5 }),
        criterion({ key: 'responseRate', currentValue: 10, threshold: 80 }),
        criterion({ key: 'other', currentValue: 0, threshold: 1 }),
      ]),
      'conversationCount'
    );
    expect(message.subtitle).toBe(
      'Objectif atteint ! Il vous reste encore 2 critères à compléter pour décrocher le badge "Super engagé".'
    );
  });

  it('uses the singular for one pending criterion', () => {
    const message = getModalMessage(
      entry([
        criterion({ currentValue: 5, threshold: 5 }),
        criterion({ key: 'responseRate', currentValue: 10, threshold: 80 }),
      ]),
      'conversationCount'
    );
    expect(message.subtitle).toMatch(/encore 1 critère à compléter/);
  });

  it('just says the objective is reached when nothing else is pending', () => {
    const message = getModalMessage(
      entry([criterion({ currentValue: 6, threshold: 5 })]),
      'conversationCount'
    );
    expect(message.subtitle).toBe('Objectif atteint !');
  });

  it('encourages the response rate progress', () => {
    const message = getModalMessage(
      entry([criterion({ key: 'responseRate' })]),
      'responseRate'
    );
    expect(message.title).toBe('Continuez comme ça !');
    expect(message.subtitle).toMatch(/taux de réponse/);
  });

  it('falls back to counting pending objectives for an unknown criterion', () => {
    const plural = getModalMessage(
      entry([
        criterion({ key: 'x', currentValue: 0 }),
        criterion({ key: 'y', currentValue: 0 }),
      ]),
      'x'
    );
    expect(plural.subtitle).toBe(
      'Encore 2 objectifs à atteindre pour décrocher le badge "Super engagé".'
    );
    const singular = getModalMessage(
      entry([criterion({ key: 'x', currentValue: 0 })]),
      'x'
    );
    expect(singular.subtitle).toMatch(/Encore 1 objectif à atteindre/);
  });

  it('falls back when the changed criterion is not in the entry', () => {
    const message = getModalMessage(entry([]), 'conversationCount');
    expect(message.subtitle).toBe(
      'Vous êtes à un pas du badge "Super engagé" !'
    );
  });
});

describe('formFeedback', () => {
  it('offers coach-specific reasons', () => {
    const schema = formFeedback('Coach' as never);
    const options = (schema.fields[0] as { options: { value: string }[] })
      .options;
    expect(options.map((o) => o.value)).toEqual([
      'already_full',
      'no_more_time',
      'vacation',
      'no_more_help',
    ]);
  });

  it('offers candidate-specific reasons', () => {
    const schema = formFeedback('Candidat' as never);
    const options = (schema.fields[0] as { options: { value: string }[] })
      .options;
    expect(options.map((o) => o.value)).toEqual([
      'already_full',
      'vacation',
      'no_more_help',
      'other_support',
    ]);
  });

  it('makes the answer optional', () => {
    const schema = formFeedback('Coach' as never);
    expect(schema.fields[0]).toMatchObject({
      name: 'unavailabilityReason',
      component: 'radio',
      isRequired: false,
    });
  });
});
