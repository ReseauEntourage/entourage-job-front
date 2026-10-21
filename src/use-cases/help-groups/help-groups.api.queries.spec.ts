jest.mock('@/src/api');

import { AxiosError, AxiosHeaders } from 'axios';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  buildCard,
  buildDiscussion,
  buildDiscussionItem,
  buildGroupPage,
  buildReply,
} from '@/src/features/backoffice/help-groups/__fixtures__/help-groups.fixtures';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  DISCUSSIONS_PAGE_SIZE,
  helpGroupsApi,
  HelpGroupsError,
  HelpGroupsWriteError,
  REPLIES_PAGE_SIZE,
} from './help-groups.api';

const mockedApi = getMockedApi();

const axiosError = (status: number) =>
  new AxiosError('error', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: {},
  });

const key = { slug: 'refaire-un-cv', discussionId: 'discussion-1' };
const endpoints = helpGroupsApi.endpoints;

describe('help groups api', () => {
  afterEach(() => jest.clearAllMocks());

  describe('read queries', () => {
    it('loads the catalog and a group page', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroups.mockResolvedValue({
        data: [buildCard()],
      } as never);
      mockedApi.getHelpGroup.mockResolvedValue({
        data: buildGroupPage(),
      } as never);

      const catalog = await store.dispatch(endpoints.getHelpGroups.initiate());
      const page = await store.dispatch(
        endpoints.getHelpGroup.initiate('refaire-un-cv')
      );

      expect(catalog.data).toHaveLength(1);
      expect(page.data?.slug).toBe('refaire-un-cv');
      expect(mockedApi.getHelpGroup).toHaveBeenCalledWith('refaire-un-cv');
    });

    it('reads a 404 as "not found" and any other failure as "fetch failed"', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroup.mockRejectedValueOnce(axiosError(404));
      const notFound = await store.dispatch(
        endpoints.getHelpGroup.initiate('missing')
      );
      expect(notFound.error).toBe(HelpGroupsError.NOT_FOUND);

      mockedApi.getHelpGroup.mockRejectedValueOnce(axiosError(500));
      const failed = await store.dispatch(
        endpoints.getHelpGroup.initiate('broken')
      );
      expect(failed.error).toBe(HelpGroupsError.FETCH_FAILED);

      mockedApi.getHelpGroup.mockRejectedValueOnce(new Error('network'));
      const network = await store.dispatch(
        endpoints.getHelpGroup.initiate('offline')
      );
      expect(network.error).toBe(HelpGroupsError.FETCH_FAILED);
    });

    it('loads one discussion', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion(),
      } as never);
      const result = await store.dispatch(
        endpoints.getHelpGroupDiscussion.initiate(key)
      );
      expect(mockedApi.getHelpGroupDiscussion).toHaveBeenCalledWith(
        key.slug,
        key.discussionId
      );
      expect(result.data).toBeDefined();
    });

    it('pages through the discussions with the cursor of the previous page', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussions
        .mockResolvedValueOnce({
          data: {
            items: [buildDiscussionItem({ id: 'd1' })],
            nextCursor: 'next',
          },
        } as never)
        .mockResolvedValueOnce({
          data: {
            items: [buildDiscussionItem({ id: 'd2' })],
            nextCursor: null,
          },
        } as never);

      await store.dispatch(
        endpoints.getHelpGroupDiscussions.initiate('refaire-un-cv')
      );
      expect(mockedApi.getHelpGroupDiscussions).toHaveBeenLastCalledWith(
        'refaire-un-cv',
        { limit: DISCUSSIONS_PAGE_SIZE }
      );

      await store.dispatch(
        endpoints.getHelpGroupDiscussions.initiate('refaire-un-cv', {
          direction: 'forward',
        } as never) as never
      );
      const state = endpoints.getHelpGroupDiscussions.select('refaire-un-cv')(
        store.getState() as never
      );
      expect(state.data?.pages.length).toBeGreaterThanOrEqual(1);
    });

    it('pages through the replies with the "after" cursor', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussionReplies.mockResolvedValue({
        data: { items: [buildReply({ id: 'r1' })], nextCursor: null },
      } as never);
      await store.dispatch(
        endpoints.getHelpGroupDiscussionReplies.initiate(key)
      );
      expect(mockedApi.getHelpGroupDiscussionReplies).toHaveBeenCalledWith(
        key.slug,
        key.discussionId,
        { limit: REPLIES_PAGE_SIZE }
      );
    });

    it('loads the revisions of a message and the admin list', async () => {
      const store = createTestStore();
      mockedApi.getAdminHelpGroupMessageRevisions.mockResolvedValue({
        data: { revisions: [] },
      } as never);
      mockedApi.getAdminHelpGroups.mockResolvedValue({ data: [] } as never);

      await store.dispatch(
        endpoints.getHelpGroupMessageRevisions.initiate({
          kind: 'replies',
          id: 'r1',
        })
      );
      await store.dispatch(endpoints.getAdminHelpGroups.initiate(true));

      expect(mockedApi.getAdminHelpGroupMessageRevisions).toHaveBeenCalledWith(
        'replies',
        'r1'
      );
      expect(mockedApi.getAdminHelpGroups).toHaveBeenCalledWith(true);
    });
  });

  describe('membership', () => {
    it('joins and leaves a group', async () => {
      const store = createTestStore();
      mockedApi.postHelpGroupMembership.mockResolvedValue({
        data: {},
      } as never);
      mockedApi.deleteHelpGroupMembership.mockResolvedValue({
        data: {},
      } as never);

      await store.dispatch(endpoints.joinHelpGroup.initiate('g'));
      await store.dispatch(endpoints.leaveHelpGroup.initiate('g'));

      expect(mockedApi.postHelpGroupMembership).toHaveBeenCalledWith('g');
      expect(mockedApi.deleteHelpGroupMembership).toHaveBeenCalledWith('g');
    });

    it('maps a failed join to a typed error', async () => {
      const store = createTestStore();
      mockedApi.postHelpGroupMembership.mockRejectedValue(axiosError(409));
      const result = await store.dispatch(
        endpoints.joinHelpGroup.initiate('g')
      );
      expect(result.error).toBe(HelpGroupsWriteError.CHARTER_NOT_ACCEPTED);
    });

    it('applies the e-mail preference at once and keeps it when the server agrees', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroup.mockResolvedValue({
        data: buildGroupPage({ emailsEnabled: true }),
      } as never);
      await store.dispatch(endpoints.getHelpGroup.initiate('g'));
      mockedApi.patchHelpGroupMembership.mockResolvedValue({
        data: { emailsEnabled: false },
      } as never);

      await store.dispatch(
        endpoints.updateHelpGroupEmails.initiate({
          slug: 'g',
          emailsEnabled: false,
        })
      );

      expect(mockedApi.patchHelpGroupMembership).toHaveBeenCalledWith('g', {
        emailsEnabled: false,
      });
      expect(
        endpoints.getHelpGroup.select('g')(store.getState() as never).data
          ?.emailsEnabled
      ).toBe(false);
    });

    it('rolls the e-mail preference back when the server refuses', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroup.mockResolvedValue({
        data: buildGroupPage({ emailsEnabled: true }),
      } as never);
      await store.dispatch(endpoints.getHelpGroup.initiate('g'));
      mockedApi.patchHelpGroupMembership.mockRejectedValue(axiosError(500));

      await store.dispatch(
        endpoints.updateHelpGroupEmails.initiate({
          slug: 'g',
          emailsEnabled: false,
        })
      );

      expect(
        endpoints.getHelpGroup.select('g')(store.getState() as never).data
          ?.emailsEnabled
      ).toBe(true);
    });
  });

  describe('discussions', () => {
    it('creates a discussion and a title suggestion', async () => {
      const store = createTestStore();
      mockedApi.postHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion(),
      } as never);
      mockedApi.postHelpGroupTitleSuggestion.mockResolvedValue({
        data: { title: 'Un titre' },
      } as never);

      const created = await store.dispatch(
        endpoints.createHelpGroupDiscussion.initiate({
          slug: 'g',
          dto: { title: 't', content: 'c' } as never,
        })
      );
      const suggestion = await store.dispatch(
        endpoints.suggestHelpGroupTitle.initiate({
          slug: 'g',
          content: 'contenu',
          previousTitles: ['a'],
        })
      );

      expect(created.data).toBeDefined();
      expect(mockedApi.postHelpGroupTitleSuggestion).toHaveBeenCalledWith('g', {
        content: 'contenu',
        previousTitles: ['a'],
      });
      expect(suggestion.data?.title).toBe('Un titre');
    });

    it('does not invalidate anything when the creation fails', async () => {
      const store = createTestStore();
      mockedApi.postHelpGroupDiscussion.mockRejectedValue(axiosError(403));
      const result = await store.dispatch(
        endpoints.createHelpGroupDiscussion.initiate({
          slug: 'g',
          dto: { title: 't', content: 'c' } as never,
        })
      );
      expect(result.error).toBe(HelpGroupsWriteError.FAILED);
    });

    it('stores the edited discussion in the cache', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion({ title: 'Ancien' }),
      } as never);
      await store.dispatch(endpoints.getHelpGroupDiscussion.initiate(key));
      mockedApi.patchHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion({ title: 'Nouveau' }),
      } as never);

      await store.dispatch(
        endpoints.updateHelpGroupDiscussion.initiate({
          ...key,
          dto: { title: 'Nouveau' },
        })
      );
      await flushPromises();

      expect(mockedApi.patchHelpGroupDiscussion).toHaveBeenCalledWith(
        key.slug,
        key.discussionId,
        { title: 'Nouveau' }
      );
      expect(
        (
          endpoints.getHelpGroupDiscussion.select(key)(
            store.getState() as never
          ).data as { title?: string } | undefined
        )?.title
      ).toBe('Nouveau');
    });

    it('keeps the cached discussion when the edition fails', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion({ title: 'Ancien' }),
      } as never);
      await store.dispatch(endpoints.getHelpGroupDiscussion.initiate(key));
      mockedApi.patchHelpGroupDiscussion.mockRejectedValue(axiosError(400));

      const result = await store.dispatch(
        endpoints.updateHelpGroupDiscussion.initiate({
          ...key,
          dto: { title: 'Nouveau' },
        })
      );

      expect(result.error).toBe(HelpGroupsWriteError.INVALID);
      expect(
        (
          endpoints.getHelpGroupDiscussion.select(key)(
            store.getState() as never
          ).data as { title?: string } | undefined
        )?.title
      ).toBe('Ancien');
    });

    it('deletes a discussion', async () => {
      const store = createTestStore();
      mockedApi.deleteHelpGroupDiscussion.mockResolvedValue({
        data: {},
      } as never);
      await store.dispatch(
        endpoints.deleteHelpGroupDiscussion.initiate({ ...key })
      );
      expect(mockedApi.deleteHelpGroupDiscussion).toHaveBeenCalledWith(
        key.slug,
        key.discussionId
      );
    });
  });

  describe('replies', () => {
    const loadThread = async (store: ReturnType<typeof createTestStore>) => {
      mockedApi.getHelpGroupDiscussionReplies.mockResolvedValue({
        data: {
          items: [
            buildReply({ id: 'reply-1', content: 'v1' }),
            buildReply({ id: 'reply-2' }),
          ],
          nextCursor: null,
        },
      } as never);
      mockedApi.getHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion({ repliesCount: 2 }),
      } as never);
      await store.dispatch(
        endpoints.getHelpGroupDiscussionReplies.initiate(key)
      );
      await store.dispatch(endpoints.getHelpGroupDiscussion.initiate(key));
    };

    const readReplies = (store: ReturnType<typeof createTestStore>) =>
      endpoints.getHelpGroupDiscussionReplies
        .select(key)(store.getState() as never)
        .data?.pages.flatMap(({ items }) => items) ?? [];

    const readCount = (store: ReturnType<typeof createTestStore>) =>
      endpoints.getHelpGroupDiscussion.select(key)(store.getState() as never)
        .data?.repliesCount;

    it('counts a created reply in the discussion', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.postHelpGroupReply.mockResolvedValue({
        data: buildReply({ id: 'reply-3' }),
      } as never);
      await store.dispatch(
        endpoints.createHelpGroupReply.initiate({
          ...key,
          dto: { content: 'x' },
        })
      );
      expect(readCount(store)).toBe(3);
    });

    it('does not touch the thread when the creation fails', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.postHelpGroupReply.mockRejectedValue(axiosError(403));
      const result = await store.dispatch(
        endpoints.createHelpGroupReply.initiate({
          ...key,
          dto: { content: 'x' },
        })
      );
      expect(result.error).toBe(HelpGroupsWriteError.FAILED);
      expect(readReplies(store)).toHaveLength(2);
      expect(readCount(store)).toBe(2);
    });

    it('replaces an edited reply in the loaded thread', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.patchHelpGroupReply.mockResolvedValue({
        data: buildReply({ id: 'reply-1', content: 'v2' }),
      } as never);
      await store.dispatch(
        endpoints.updateHelpGroupReply.initiate({
          ...key,
          replyId: 'reply-1',
          content: 'v2',
        })
      );
      expect(mockedApi.patchHelpGroupReply).toHaveBeenCalledWith(
        key.slug,
        key.discussionId,
        'reply-1',
        { content: 'v2' }
      );
      expect(
        (
          readReplies(store).find(({ id }) => id === 'reply-1') as {
            content: string;
          }
        ).content
      ).toBe('v2');
    });

    it('keeps the reply when the edition fails', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.patchHelpGroupReply.mockRejectedValue(axiosError(500));
      await store.dispatch(
        endpoints.updateHelpGroupReply.initiate({
          ...key,
          replyId: 'reply-1',
          content: 'v2',
        })
      );
      expect(
        (
          readReplies(store).find(({ id }) => id === 'reply-1') as {
            content: string;
          }
        ).content
      ).toBe('v1');
    });

    it('removes a deleted reply and decrements the counter', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.deleteHelpGroupReply.mockResolvedValue({ data: {} } as never);
      await store.dispatch(
        endpoints.deleteHelpGroupReply.initiate({ ...key, replyId: 'reply-1' })
      );
      expect(readReplies(store).map(({ id }) => id)).toEqual(['reply-2']);
      expect(readCount(store)).toBe(1);
    });

    it('keeps the reply when its deletion fails', async () => {
      const store = createTestStore();
      await loadThread(store);
      mockedApi.deleteHelpGroupReply.mockRejectedValue(axiosError(500));
      await store.dispatch(
        endpoints.deleteHelpGroupReply.initiate({ ...key, replyId: 'reply-1' })
      );
      expect(readReplies(store)).toHaveLength(2);
      expect(readCount(store)).toBe(2);
    });
  });

  describe('moderation by an admin', () => {
    it('removes a deleted reply from the open thread', async () => {
      const store = createTestStore();
      mockedApi.getHelpGroupDiscussionReplies.mockResolvedValue({
        data: { items: [buildReply({ id: 'reply-1' })], nextCursor: null },
      } as never);
      mockedApi.getHelpGroupDiscussion.mockResolvedValue({
        data: buildDiscussion({ repliesCount: 1 }),
      } as never);
      await store.dispatch(
        endpoints.getHelpGroupDiscussionReplies.initiate(key)
      );
      await store.dispatch(endpoints.getHelpGroupDiscussion.initiate(key));
      mockedApi.deleteAdminHelpGroupMessage.mockResolvedValue({
        data: {},
      } as never);

      await store.dispatch(
        endpoints.deleteHelpGroupMessageAsAdmin.initiate({
          kind: 'replies',
          id: 'reply-1',
          ...key,
          dto: { reason: 'SPAM' } as never,
        })
      );

      expect(mockedApi.deleteAdminHelpGroupMessage).toHaveBeenCalledWith(
        'replies',
        'reply-1',
        { reason: 'SPAM' }
      );
      expect(
        endpoints.getHelpGroupDiscussionReplies
          .select(key)(store.getState() as never)
          .data?.pages.flatMap(({ items }) => items)
      ).toHaveLength(0);
      expect(
        endpoints.getHelpGroupDiscussion.select(key)(store.getState() as never)
          .data?.repliesCount
      ).toBe(0);
    });

    it('does not touch any thread for a discussion deletion', async () => {
      const store = createTestStore();
      mockedApi.deleteAdminHelpGroupMessage.mockResolvedValue({
        data: {},
      } as never);
      const result = await store.dispatch(
        endpoints.deleteHelpGroupMessageAsAdmin.initiate({
          kind: 'discussions',
          id: 'discussion-1',
          dto: { reason: 'SPAM' } as never,
        })
      );
      expect(result.error).toBeUndefined();
    });

    it('reports a failed moderation', async () => {
      const store = createTestStore();
      mockedApi.deleteAdminHelpGroupMessage.mockRejectedValue(axiosError(403));
      const result = await store.dispatch(
        endpoints.deleteHelpGroupMessageAsAdmin.initiate({
          kind: 'replies',
          id: 'reply-1',
          ...key,
          dto: { reason: 'SPAM' } as never,
        })
      );
      expect(result.error).toBe(HelpGroupsWriteError.FAILED);
    });
  });

  describe('administration of the groups', () => {
    it('creates, updates, runs an action on and deletes a group', async () => {
      const store = createTestStore();
      mockedApi.postAdminHelpGroup.mockResolvedValue({ data: {} } as never);
      mockedApi.putAdminHelpGroup.mockResolvedValue({ data: {} } as never);
      mockedApi.postAdminHelpGroupAction.mockResolvedValue({
        data: {},
      } as never);
      mockedApi.deleteAdminHelpGroup.mockResolvedValue({ data: {} } as never);
      const dto = { name: 'Nouveau' } as never;

      await store.dispatch(endpoints.createHelpGroup.initiate(dto));
      await store.dispatch(
        endpoints.updateHelpGroup.initiate({ id: 'g1', dto })
      );
      await store.dispatch(
        endpoints.runHelpGroupAction.initiate({
          id: 'g1',
          action: 'publish' as never,
        })
      );
      await store.dispatch(endpoints.deleteHelpGroup.initiate('g1'));

      expect(mockedApi.postAdminHelpGroup).toHaveBeenCalledWith(dto);
      expect(mockedApi.putAdminHelpGroup).toHaveBeenCalledWith('g1', dto);
      expect(mockedApi.postAdminHelpGroupAction).toHaveBeenCalledWith(
        'g1',
        'publish'
      );
      expect(mockedApi.deleteAdminHelpGroup).toHaveBeenCalledWith('g1');
    });

    it('turns any failure into a mutation failure', async () => {
      const store = createTestStore();
      mockedApi.postAdminHelpGroup.mockRejectedValue(new Error('boom'));
      mockedApi.putAdminHelpGroup.mockRejectedValue(new Error('boom'));
      mockedApi.postAdminHelpGroupAction.mockRejectedValue(new Error('boom'));
      mockedApi.deleteAdminHelpGroup.mockRejectedValue(new Error('boom'));
      const dto = { name: 'Nouveau' } as never;

      const results = [
        await store.dispatch(endpoints.createHelpGroup.initiate(dto)),
        await store.dispatch(
          endpoints.updateHelpGroup.initiate({ id: 'g1', dto })
        ),
        await store.dispatch(
          endpoints.runHelpGroupAction.initiate({
            id: 'g1',
            action: 'publish' as never,
          })
        ),
        await store.dispatch(endpoints.deleteHelpGroup.initiate('g1')),
      ];
      results.forEach((result) =>
        expect(result.error).toBe(HelpGroupsError.MUTATION_FAILED)
      );
    });
  });
});
