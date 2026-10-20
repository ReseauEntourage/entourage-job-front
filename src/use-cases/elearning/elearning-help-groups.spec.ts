jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { buildGroupPage } from '@/src/features/backoffice/help-groups/__fixtures__/help-groups.fixtures';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { helpGroupsApi } from '@/src/use-cases/help-groups/help-groups.api';
import { elearningApi } from './elearning.api';

const mockedApi = getMockedApi();

const SLUG = 'refaire-un-cv';

/**
 * EN-9686: the CTA of a help group comes from the server-computed
 * `viewerPermissions.state`, cached under the `HelpGroups` tag. Finishing the
 * e-learning must not leave that cached state stale.
 */
describe('e-learning completion and the help group cache (EN-9686)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('serves the refreshed viewer state when the user comes back to the group after finishing the training', async () => {
    seedAccessToken('token-123');
    const store = createTestStore();

    // The server recomputes the state on each read, from the user's training
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
    mockedApi.postElearningCompletion.mockImplementation(async () => {
      trainingCompleted = true;
      return {
        data: {
          id: 'completion-1',
          userId: 'user-1',
          unitId: 'unit-1',
          validatedAt: '2026-01-01T00:00:00.000Z',
        },
      } as any;
    });
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'user-1' },
    } as any);

    // 1. The user opens the group: "finish your training" invitation
    const firstVisit = store.dispatch(
      helpGroupsApi.endpoints.getHelpGroup.initiate(SLUG)
    );
    expect((await firstVisit).data?.viewerPermissions.state).toBe(
      'mustCompleteElearning'
    );

    // 2. They follow the link to the training: the group page unmounts
    firstVisit.unsubscribe();

    // 3. They finish the training
    await store.dispatch(
      elearningApi.endpoints.postElearningCompletion.initiate({
        unitId: 'unit-1',
        role: UserRoles.CANDIDATE,
      })
    );
    await flushPromises();

    // 4. They come back to the group (within RTK Query's unused-data delay)
    const secondVisit = await store.dispatch(
      helpGroupsApi.endpoints.getHelpGroup.initiate(SLUG)
    );

    expect(secondVisit.data?.viewerPermissions.state).toBe('mustJoin');
  });
});
