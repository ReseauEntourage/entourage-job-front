jest.mock('@/src/api');

import { AxiosError, AxiosHeaders } from 'axios';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { HelpGroupDiscussion } from '@/src/api/types';
import {
  buildDiscussion,
  buildReply,
} from '@/src/features/backoffice/help-groups/__fixtures__/help-groups.fixtures';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { authenticationApi } from '@/src/use-cases/authentication';
import {
  applyViewerReaction,
  helpGroupsApi,
  HelpGroupsWriteError,
  toWriteError,
} from './help-groups.api';
import {
  getHelpGroupDraftKey,
  readHelpGroupDraft,
  writeHelpGroupDraft,
} from './help-groups.drafts';

const mockedApi = getMockedApi();

const axiosError = (status: number, message?: string) =>
  new AxiosError('error', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: message ? { message } : {},
  });

const key = { slug: 'refaire-un-cv', discussionId: 'discussion-1' };

describe('help groups write api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('toWriteError', () => {
    const cases: [unknown, HelpGroupsWriteError][] = [
      [axiosError(409), HelpGroupsWriteError.CHARTER_NOT_ACCEPTED],
      [
        axiosError(403, 'ELEARNING_NOT_COMPLETED'),
        HelpGroupsWriteError.ELEARNING_NOT_COMPLETED,
      ],
      [
        axiosError(403, 'HELP_GROUP_NOT_MEMBER'),
        HelpGroupsWriteError.NOT_MEMBER,
      ],
      [
        axiosError(404, 'HELP_GROUP_DISCUSSION_NOT_FOUND'),
        HelpGroupsWriteError.DISCUSSION_NOT_FOUND,
      ],
      [axiosError(404), HelpGroupsWriteError.NOT_FOUND],
      [axiosError(400), HelpGroupsWriteError.INVALID],
      [axiosError(500), HelpGroupsWriteError.FAILED],
      [new Error('network'), HelpGroupsWriteError.FAILED],
    ];
    cases.forEach(([error, expected], index) => {
      it(`maps the error case ${index + 1} to ${expected}`, () => {
        expect(toWriteError(error)).toBe(expected);
      });
    });
  });

  describe('applyViewerReaction', () => {
    it('adds the viewer with the chosen emoji, in the palette order', () => {
      expect(
        applyViewerReaction(
          { emojis: ['🎉'], firstNames: ['Amina'], hasOthers: false },
          null,
          '💪',
          'Julien'
        )
      ).toEqual({
        emojis: ['💪', '🎉'],
        firstNames: ['Amina', 'Julien'],
        hasOthers: false,
      });
    });

    it('gives a summary to a message without reaction', () => {
      expect(applyViewerReaction(null, null, '❤️', 'Julien')).toEqual({
        emojis: ['❤️'],
        firstNames: ['Julien'],
        hasOthers: false,
      });
    });

    it('removes the summary when the viewer was the only one', () => {
      expect(
        applyViewerReaction(
          { emojis: ['💪'], firstNames: ['Julien'], hasOthers: false },
          '💪',
          null,
          'Julien'
        )
      ).toBeNull();
    });

    it('keeps the other people when the viewer removes their reaction', () => {
      expect(
        applyViewerReaction(
          { emojis: ['💪'], firstNames: ['Amina', 'Julien'], hasOthers: false },
          '💪',
          null,
          'Julien'
        )
      ).toEqual({ emojis: ['💪'], firstNames: ['Amina'], hasOthers: false });
    });
  });

  describe('setHelpGroupReaction', () => {
    const seedDiscussion = (store: ReturnType<typeof createTestStore>) =>
      store.dispatch(
        helpGroupsApi.util.upsertQueryData(
          'getHelpGroupDiscussion',
          key,
          buildDiscussion({ id: key.discussionId })
        )
      );

    const readDiscussion = (store: ReturnType<typeof createTestStore>) =>
      helpGroupsApi.endpoints.getHelpGroupDiscussion.select(key)(
        store.getState() as never
      ).data as HelpGroupDiscussion | undefined;

    it('shows the reaction at once, then the server summary', async () => {
      const store = createTestStore();
      await seedDiscussion(store);
      let resolve: (value: unknown) => void = () => undefined;
      mockedApi.putHelpGroupReaction.mockReturnValue(
        new Promise((res) => {
          resolve = res;
        }) as never
      );

      const pending = store.dispatch(
        helpGroupsApi.endpoints.setHelpGroupReaction.initiate({
          ...key,
          target: { discussionId: key.discussionId },
          emoji: '💪',
          viewerFirstName: 'Julien',
        })
      );
      expect(readDiscussion(store)?.viewerReaction).toBe('💪');
      expect(readDiscussion(store)?.reactionsSummary?.firstNames).toEqual([
        'Julien',
      ]);

      resolve({
        data: {
          targetId: key.discussionId,
          viewerReaction: '💪',
          reactionsSummary: {
            emojis: ['💪'],
            firstNames: ['Julien', 'Amina'],
            hasOthers: false,
          },
        },
      });
      await pending;
      expect(readDiscussion(store)?.reactionsSummary?.firstNames).toEqual([
        'Julien',
        'Amina',
      ]);
    });

    it('refreshes the discussions list after a reaction to the discussion only', async () => {
      const store = createTestStore();
      await seedDiscussion(store);
      mockedApi.getHelpGroupDiscussions.mockResolvedValue({
        data: { items: [], nextCursor: null },
      } as never);
      const subscription = store.dispatch(
        helpGroupsApi.endpoints.getHelpGroupDiscussions.initiate(key.slug)
      );
      await subscription;
      expect(mockedApi.getHelpGroupDiscussions).toHaveBeenCalledTimes(1);
      const result = {
        data: {
          targetId: 'x',
          viewerReaction: '💪',
          reactionsSummary: null,
        },
      };
      mockedApi.putHelpGroupReaction.mockResolvedValue(result as never);

      await store.dispatch(
        helpGroupsApi.endpoints.setHelpGroupReaction.initiate({
          ...key,
          target: { replyId: 'reply-1' },
          emoji: '💪',
          viewerFirstName: 'Julien',
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockedApi.getHelpGroupDiscussions).toHaveBeenCalledTimes(1);

      await store.dispatch(
        helpGroupsApi.endpoints.setHelpGroupReaction.initiate({
          ...key,
          target: { discussionId: key.discussionId },
          emoji: '💪',
          viewerFirstName: 'Julien',
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockedApi.getHelpGroupDiscussions).toHaveBeenCalledTimes(2);
      subscription.unsubscribe();
    });

    it('comes back to the previous state on failure', async () => {
      const store = createTestStore();
      await seedDiscussion(store);
      mockedApi.deleteHelpGroupReaction.mockRejectedValue(axiosError(500));
      store.dispatch(
        helpGroupsApi.util.updateQueryData(
          'getHelpGroupDiscussion',
          key,
          (draft) => {
            const discussion = draft as HelpGroupDiscussion;
            discussion.viewerReaction = '🎉';
            discussion.reactionsSummary = {
              emojis: ['🎉'],
              firstNames: ['Julien'],
              hasOthers: false,
            };
          }
        )
      );

      const result = await store.dispatch(
        helpGroupsApi.endpoints.setHelpGroupReaction.initiate({
          ...key,
          target: { discussionId: key.discussionId },
          emoji: null,
          viewerFirstName: 'Julien',
        })
      );
      expect('error' in result && result.error).toBe(
        HelpGroupsWriteError.FAILED
      );
      expect(readDiscussion(store)?.viewerReaction).toBe('🎉');
      expect(readDiscussion(store)?.reactionsSummary?.firstNames).toEqual([
        'Julien',
      ]);
    });
  });

  describe('createHelpGroupReply', () => {
    it('appends the reply once to the loaded thread', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussionReplies.mockResolvedValue({
        data: { items: [buildReply({ id: 'reply-1' })], nextCursor: null },
      } as never);
      await store.dispatch(
        helpGroupsApi.endpoints.getHelpGroupDiscussionReplies.initiate(key)
      );
      const created = buildReply({ id: 'reply-2' });
      mockedApi.postHelpGroupReply.mockResolvedValue({
        data: created,
      } as never);

      await store.dispatch(
        helpGroupsApi.endpoints.createHelpGroupReply.initiate({
          ...key,
          dto: { content: 'Réponse' },
        })
      );
      await store.dispatch(
        helpGroupsApi.endpoints.createHelpGroupReply.initiate({
          ...key,
          dto: { content: 'Réponse' },
        })
      );

      const replies =
        helpGroupsApi.endpoints.getHelpGroupDiscussionReplies.select(key)(
          store.getState() as never
        ).data;
      expect(
        replies?.pages.flatMap(({ items }) => items).map(({ id }) => id)
      ).toEqual(['reply-1', 'reply-2']);
    });
  });

  describe('drafts', () => {
    it('erases every help groups draft at logout', async () => {
      const store = createTestStore();
      const draftKey = getHelpGroupDraftKey('user-1', 'group', 'group-1');
      writeHelpGroupDraft(draftKey, { content: 'Bonjour' });
      localStorage.setItem('other-key', 'kept');

      await store.dispatch(authenticationApi.endpoints.logout.initiate());

      expect(readHelpGroupDraft(draftKey)).toBeNull();
      expect(localStorage.getItem('other-key')).toBe('kept');
    });

    it('works without storage when localStorage throws', () => {
      const getItem = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('denied');
        });
      const setItem = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('denied');
        });
      expect(() => writeHelpGroupDraft('key', { content: 'x' })).not.toThrow();
      expect(readHelpGroupDraft('key')).toBeNull();
      getItem.mockRestore();
      setItem.mockRestore();
    });
  });
});
