jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { registrationActions } from '@/src/use-cases/registration';
import { WizardSummary } from './WizardSummary/WizardSummary';

const mockUseRouter = useRouter as jest.Mock;

describe('WizardSummary', () => {
  function setup(value: RegistrationFlow[] = []) {
    const push = jest.fn();
    mockUseRouter.mockReturnValue({ push });
    const store = createTestStore();
    const dispatched: any[] = [];
    const realDispatch = store.dispatch;
    jest.spyOn(store, 'dispatch').mockImplementation(((action: any) => {
      dispatched.push(action);
      return realDispatch(action);
    }) as any);
    const onChange = jest.fn();
    renderWithProviders(<WizardSummary value={value} onChange={onChange} />, {
      store,
    });
    return { push, dispatched, onChange };
  }

  it('resets the registration data when displayed', () => {
    const { dispatched } = setup();

    expect(dispatched).toContainEqual(
      registrationActions.resetRegistrationData()
    );
  });

  it('disables the start button until a flow is selected', () => {
    const { push, dispatched } = setup();
    const button = screen
      .getByText("Commencer l'inscription")
      .closest('button')!;

    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(push).not.toHaveBeenCalled();
    expect(
      dispatched.filter(
        (a) =>
          a.type ===
          registrationActions.moveForwardInRegistration({} as any).type
      )
    ).toHaveLength(0);
  });

  it('starts the registration of the selected flow', () => {
    const { push, dispatched } = setup([RegistrationFlow.COACH]);

    fireEvent.click(screen.getByText("Commencer l'inscription"));

    expect(dispatched).toContainEqual(
      registrationActions.moveForwardInRegistration({
        flow: RegistrationFlow.COACH,
        step: 0,
      })
    );
    expect(push).toHaveBeenCalledWith(
      `/wizard/run?flow=${RegistrationFlow.COACH}`
    );
  });

  it('reports the chosen flow and links to the login page', () => {
    const { onChange } = setup();

    fireEvent.click(screen.getByText('Je cherche un emploi'));

    expect(onChange).toHaveBeenCalledWith([RegistrationFlow.CANDIDATE]);
    expect(
      screen.getByText('Connectez-vous').closest('a')?.getAttribute('href')
    ).toBe('/login');
  });
});
