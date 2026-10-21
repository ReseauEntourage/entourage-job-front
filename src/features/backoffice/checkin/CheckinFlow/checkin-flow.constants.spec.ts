// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  CheckinExchangeFrequency,
  CheckinExchangeMode,
  CheckinPerceivedSupport,
  CheckinStillInTouch,
} from '@/src/constants/checkin';
import { UserRoles } from '@/src/constants/users';
import {
  CHECKIN_QUESTION_STEP_ORDER,
  CheckinStepId,
  exchangeFrequencyOptions,
  exchangeModeOptions,
  getQuestionTitle,
  perceivedSupportOptions,
  stillInTouchOptions,
} from './checkin-flow.constants';

describe('checkin flow constants', () => {
  it('counts six questions, without the comment and final screens', () => {
    expect(CHECKIN_QUESTION_STEP_ORDER).toHaveLength(6);
    expect(CHECKIN_QUESTION_STEP_ORDER).not.toContain(CheckinStepId.COMMENT);
    expect(CHECKIN_QUESTION_STEP_ORDER).not.toContain(CheckinStepId.FINAL);
    expect(CHECKIN_QUESTION_STEP_ORDER[0]).toBe(CheckinStepId.STILL_IN_TOUCH);
    expect(CHECKIN_QUESTION_STEP_ORDER[5]).toBe(CheckinStepId.RATING);
  });

  it('builds one labelled option per enum value', () => {
    expect(stillInTouchOptions().map((o) => o.value)).toEqual(
      Object.values(CheckinStillInTouch)
    );
    expect(exchangeModeOptions().map((o) => o.value)).toEqual(
      Object.values(CheckinExchangeMode)
    );
    expect(exchangeFrequencyOptions().map((o) => o.value)).toEqual(
      Object.values(CheckinExchangeFrequency)
    );
    expect(perceivedSupportOptions().map((o) => o.value)).toEqual(
      Object.values(CheckinPerceivedSupport)
    );
    [
      ...stillInTouchOptions(),
      ...exchangeModeOptions(),
      ...exchangeFrequencyOptions(),
      ...perceivedSupportOptions(),
    ].forEach((option) => expect(option.label).toBeTruthy());
  });

  it('gives radio options a unique input id', () => {
    const ids = [
      ...stillInTouchOptions(),
      ...exchangeFrequencyOptions(),
      ...perceivedSupportOptions(),
    ].map((o) => o.inputId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe('getQuestionTitle', () => {
    it('names the other participant in the questions', () => {
      expect(
        getQuestionTitle(CheckinStepId.STILL_IN_TOUCH, UserRoles.COACH, 'Awa')
      ).toBe('Êtes-vous encore en lien avec Awa ?');
      expect(
        getQuestionTitle(CheckinStepId.RATING, UserRoles.COACH, 'Awa')
      ).toBe('Comment noteriez-vous votre relation avec Awa ?');
    });

    it('uses the present tense unless the relation ended', () => {
      const title = (stillInTouch: CheckinStillInTouch | null) =>
        getQuestionTitle(
          CheckinStepId.EXCHANGE_MODES,
          UserRoles.COACH,
          'Awa',
          stillInTouch
        );
      expect(title(null)).toBe('Par quels moyens échangez-vous avec Awa ?');
      expect(title(CheckinStillInTouch.YES)).toBe(
        'Par quels moyens échangez-vous avec Awa ?'
      );
      const past = Object.values(CheckinStillInTouch).find(
        (value) => value !== CheckinStillInTouch.YES
      ) as CheckinStillInTouch;
      expect(title(past)).toBe('Par quels moyens échangiez-vous avec Awa ?');
      expect(
        getQuestionTitle(
          CheckinStepId.EXCHANGE_FREQUENCY,
          UserRoles.COACH,
          'Awa',
          past
        )
      ).toBe('À quelle fréquence échangiez-vous avec Awa ?');
      expect(
        getQuestionTitle(
          CheckinStepId.EXCHANGE_FREQUENCY,
          UserRoles.COACH,
          'Awa'
        )
      ).toBe('À quelle fréquence échangez-vous avec Awa ?');
    });

    it('adapts the benefits and support titles to the role', () => {
      expect(
        getQuestionTitle(
          CheckinStepId.PERCEIVED_BENEFITS,
          UserRoles.CANDIDATE,
          'Awa'
        )
      ).toBe('Ce que ces échanges vous ont permis de...');
      expect(
        getQuestionTitle(
          CheckinStepId.PERCEIVED_BENEFITS,
          UserRoles.COACH,
          'Awa'
        )
      ).toBe('Ce que ces échanges vous ont apporté :');
      expect(
        getQuestionTitle(
          CheckinStepId.PERCEIVED_SUPPORT,
          UserRoles.CANDIDATE,
          'Awa'
        )
      ).toBe('Vous êtes-vous senti·e soutenu·e dans votre démarche ?');
      expect(
        getQuestionTitle(
          CheckinStepId.PERCEIVED_SUPPORT,
          UserRoles.COACH,
          'Awa'
        )
      ).toContain('utile à Awa');
    });

    it('returns an empty title for the steps without question', () => {
      expect(
        getQuestionTitle(CheckinStepId.INTRO, UserRoles.COACH, 'Awa')
      ).toBe('');
      expect(
        getQuestionTitle(CheckinStepId.FINAL, UserRoles.COACH, 'Awa')
      ).toBe('');
    });
  });
});
