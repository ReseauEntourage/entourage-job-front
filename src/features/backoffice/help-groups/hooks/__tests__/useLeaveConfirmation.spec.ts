import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useLeaveConfirmation } from '../useLeaveConfirmation';

const mockOn = jest.fn();
const mockOff = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/backoffice/groupes/refaire-un-cv',
    events: { on: mockOn, off: mockOff, emit: jest.fn() },
  }),
}));

describe('useLeaveConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks nothing without typed text', () => {
    const addEventListener = jest.spyOn(window, 'addEventListener');
    renderHook(() => useLeaveConfirmation(false));
    expect(addEventListener).not.toHaveBeenCalledWith(
      'beforeunload',
      expect.anything()
    );
    expect(mockOn).not.toHaveBeenCalled();
    addEventListener.mockRestore();
  });

  it('asks before leaving the page with typed text', () => {
    renderHook(() => useLeaveConfirmation(true));
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(mockOn).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('cancels an in-app navigation when the person does not confirm', () => {
    renderHook(() => useLeaveConfirmation(true));
    const onRouteChangeStart = mockOn.mock.calls[0][1];
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    expect(() => onRouteChangeStart('/backoffice/dashboard')).toThrow();
    confirm.mockReturnValue(true);
    expect(() => onRouteChangeStart('/backoffice/dashboard')).not.toThrow();
    confirm.mockRestore();
  });
});
