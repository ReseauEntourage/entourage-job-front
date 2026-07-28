// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  selectFormErrorMessage,
  selectWebinarSfId,
} from './onboarding.selectors';
import { RootState, slice } from './onboarding.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    onboarding: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('onboarding.selectors', () => {
  describe('selectWebinarSfId', () => {
    it('returns the webinar Salesforce id', () => {
      expect(selectWebinarSfId(buildState({ webinarSfId: 'sf-id-1' }))).toBe(
        'sf-id-1'
      );
    });

    it('returns null when there is no webinar Salesforce id', () => {
      expect(selectWebinarSfId(buildState())).toBeNull();
    });
  });

  describe('selectFormErrorMessage', () => {
    it('returns the form error message', () => {
      expect(
        selectFormErrorMessage(
          buildState({ formErrorMessage: 'Une erreur est survenue' })
        )
      ).toBe('Une erreur est survenue');
    });

    it('returns null when there is no form error message', () => {
      expect(selectFormErrorMessage(buildState())).toBeNull();
    });
  });
});
