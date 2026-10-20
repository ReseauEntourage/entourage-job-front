jest.mock('@/src/api');

import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { elearningApi } from '@/src/use-cases/elearning';
import { HelpGroupPage } from '../HelpGroupPage';
import { buildGroupPage } from '../__fixtures__/help-groups.fixtures';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/backoffice/groupes/refaire-un-cv',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

const mockedApi = getMockedApi();

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

describe('Help group page after the e-learning completion (EN-9686)', () => {
  it('shows the join invitation when the user comes back after finishing the training', async () => {
    seedAccessToken('token-123');
    let trainingCompleted = false;
    mockedApi.getHelpGroup.mockImplementation(
      async () =>
        ({
          data: buildGroupPage({
            isMember: false,
            viewerPermissions: {
              state: trainingCompleted ? 'mustJoin' : 'mustCompleteElearning',
              charterAccepted: false,
            },
          }),
        }) as any
    );
    mockedApi.getHelpGroupDiscussions.mockResolvedValue({
      data: { items: [], nextCursor: null },
    } as any);
    mockedApi.getHelpGroupMembers.mockResolvedValue({
      data: { members: [], total: 0 },
    } as any);
    mockedApi.postElearningCompletion.mockImplementation(async () => {
      trainingCompleted = true;
      return {
        data: {
          id: 'c-1',
          userId: 'u-1',
          unitId: 'unit-1',
          validatedAt: '2026-01-01T00:00:00.000Z',
        },
      } as any;
    });
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'u-1' },
    } as any);

    // 1. The group page: "finish your training"
    const first = renderWithProviders(<HelpGroupPage slug="refaire-un-cv" />);
    await screen.findByText(
      'Terminez votre formation pour participer aux groupes'
    );

    // 2. The user follows the link: the page unmounts
    first.unmount();

    // 3. The user finishes the training
    await act(async () => {
      await first.store.dispatch(
        elearningApi.endpoints.postElearningCompletion.initiate({
          unitId: 'unit-1',
          role: UserRoles.CANDIDATE,
        })
      );
    });

    // 4. The user comes back to the group page
    renderWithProviders(<HelpGroupPage slug="refaire-un-cv" />, {
      store: first.store,
    });

    expect(
      (await screen.findAllByText(/Rejoindre le groupe/)).length
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText('Terminez votre formation pour participer aux groupes')
    ).not.toBeInTheDocument();
  });
});
