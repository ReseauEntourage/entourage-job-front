jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { act, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { buildTestPassword } from '@/src/store/testUtils/buildTestPassword';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { registrationActions } from '@/src/use-cases/registration';
import { slice } from '@/src/use-cases/registration/registration.slice';
import { EmailAlreadyUsedInlineLink } from './EmailAlreadyUsedHint';
const TEST_PASSWORD = buildTestPassword();

const mockedApi = getMockedApi();

async function submitRegistration(rejection: unknown) {
  mockedApi.postUserRegistration.mockRejectedValue(rejection);
  const store = createTestStore({
    registration: {
      ...slice.getInitialState(),
      selectedFlow: RegistrationFlow.CANDIDATE,
      data: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: TEST_PASSWORD,
        confirmPassword: TEST_PASSWORD,
        phone: '0600000000',
        department: { value: 'PARIS', label: 'Paris' },
      } as any,
    },
  });
  const utils = renderWithProviders(<EmailAlreadyUsedInlineLink />, { store });
  await act(async () => {
    store.dispatch(registrationActions.createUserRequested());
    await flushPromises();
  });
  return utils;
}

describe('EmailAlreadyUsedInlineLink', () => {
  it('renders nothing before any submission', () => {
    const { container } = renderWithProviders(<EmailAlreadyUsedInlineLink />);

    expect(container.innerHTML).toBe('');
  });

  it('offers to log in when the email is already used', async () => {
    await submitRegistration({ isAxiosError: true, response: { status: 409 } });

    expect(
      screen.getByText('vous connecter').closest('a')?.getAttribute('href')
    ).toBe('/login');
  });

  it('renders nothing for any other error', async () => {
    const { container } = await submitRegistration({
      isAxiosError: true,
      response: { status: 500 },
    });

    expect(container.innerHTML).toBe('');
  });
});
