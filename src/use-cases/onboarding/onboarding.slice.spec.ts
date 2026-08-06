// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './onboarding.slice';

const { actions, reducer } = slice;

describe('onboarding slice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      webinarSfId: null,
      formErrorMessage: null,
    });
  });

  it('setWebinarSfId sets webinarSfId', () => {
    const state = reducer(undefined, actions.setWebinarSfId('sf-id-1'));

    expect(state.webinarSfId).toBe('sf-id-1');
  });

  it('setWebinarSfId can reset webinarSfId to null', () => {
    const initialState = {
      ...slice.getInitialState(),
      webinarSfId: 'sf-id-1',
    };

    const state = reducer(initialState, actions.setWebinarSfId(null));

    expect(state.webinarSfId).toBeNull();
  });

  it('setFormErrorMessage sets formErrorMessage', () => {
    const state = reducer(
      undefined,
      actions.setFormErrorMessage('Une erreur est survenue')
    );

    expect(state.formErrorMessage).toBe('Une erreur est survenue');
  });

  it('setFormErrorMessage can reset formErrorMessage to null', () => {
    const initialState = {
      ...slice.getInitialState(),
      formErrorMessage: 'Une erreur est survenue',
    };

    const state = reducer(initialState, actions.setFormErrorMessage(null));

    expect(state.formErrorMessage).toBeNull();
  });
});
