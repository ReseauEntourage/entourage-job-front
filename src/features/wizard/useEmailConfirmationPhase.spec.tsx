import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useDispatch } from 'react-redux';
import { registrationActions } from '@/src/use-cases/registration';
import { useEmailConfirmationPhase } from './useEmailConfirmationPhase';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// registrationActions pulls in registration.config.tsx -> forms -> ui,
// which transitively imports the ESM-only @react-hook/window-size.
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('useEmailConfirmationPhase', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
  });

  it('exposes canGoBack: true', () => {
    const { result } = renderHook(() =>
      useEmailConfirmationPhase({
        goToLastStep: jest.fn(),
        goToStepById: jest.fn(),
      })
    );

    expect(result.current.canGoBack).toBe(true);
  });

  it('onBack dispatches createUserReset and calls goToLastStep only', () => {
    const goToLastStep = jest.fn();
    const goToStepById = jest.fn();
    const { result } = renderHook(() =>
      useEmailConfirmationPhase({ goToLastStep, goToStepById })
    );

    result.current.onBack();

    expect(dispatch).toHaveBeenCalledWith(
      registrationActions.createUserReset()
    );
    // isEnded doit repasser à false, sinon moveForwardInRegistrationSaga
    // (déclenchée par goToLastStep) laisse isLoading bloqué à true.
    expect(dispatch).toHaveBeenCalledWith(
      registrationActions.setRegistrationIsEnded(false)
    );
    expect(goToLastStep).toHaveBeenCalledTimes(1);
    expect(goToStepById).not.toHaveBeenCalled();
  });

  it("onEditEmail dispatches createUserReset and calls goToStepById('account') only", () => {
    const goToLastStep = jest.fn();
    const goToStepById = jest.fn();
    const { result } = renderHook(() =>
      useEmailConfirmationPhase({ goToLastStep, goToStepById })
    );

    result.current.onEditEmail();

    expect(dispatch).toHaveBeenCalledWith(
      registrationActions.createUserReset()
    );
    expect(dispatch).toHaveBeenCalledWith(
      registrationActions.setRegistrationIsEnded(false)
    );
    expect(goToStepById).toHaveBeenCalledWith('account');
    expect(goToLastStep).not.toHaveBeenCalled();
  });
});
