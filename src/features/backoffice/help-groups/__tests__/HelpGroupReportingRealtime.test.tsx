import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupDiscussion } from '../HelpGroupDiscussion';
import {
  buildAuthor,
  buildDiscussion,
  buildGroupPage,
  buildHiddenReply,
  buildReply,
} from '../__fixtures__/help-groups.fixtures';

type Callback = (payload?: unknown) => void;

const channelCallbacks: Record<string, Callback> = {};
const mockPusher = {
  subscribe: jest.fn(() => ({
    bind: jest.fn((event: string, callback: Callback) => {
      channelCallbacks[event] = callback;
    }),
    unbind_all: jest.fn(),
  })),
  unsubscribe: jest.fn(),
  connection: { state: 'connected', bind: jest.fn(), unbind: jest.fn() },
};

jest.mock('@/src/api');
jest.mock('@/src/constants/pusher', () => ({
  ...jest.requireActual('@/src/constants/pusher'),
  getPusher: () => mockPusher,
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUser: () => ({ id: 'viewer-1', firstName: 'Julien' }),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const mockedApi = getMockedApi();

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

describe('Help group reporting - realtime', () => {
  it('replaces a reply by the neutral mention once it is hidden, after the realtime signal', async () => {
    mockedApi.getHelpGroup.mockResolvedValue({
      data: buildGroupPage(),
    } as never);
    mockedApi.getHelpGroupDiscussion.mockResolvedValue({
      data: buildDiscussion({
        author: buildAuthor({ id: 'claire', firstName: 'Claire' }),
        repliesCount: 1,
      }),
    } as never);
    mockedApi.getHelpGroupDiscussionReplies
      .mockResolvedValueOnce({
        data: {
          items: [buildReply({ id: 'reply-7', content: 'Message signalé' })],
          nextCursor: null,
        },
      } as never)
      .mockResolvedValue({
        data: { items: [buildHiddenReply('reply-7')], nextCursor: null },
      } as never);

    renderWithProviders(
      <HelpGroupDiscussion
        slug="refaire-un-cv"
        discussionId="discussion-1"
        replyId={null}
      />
    );
    expect(await screen.findByText('Message signalé')).toBeInTheDocument();

    await act(async () => {
      channelCallbacks['reply-updated']({
        discussionId: 'discussion-1',
        replyId: 'reply-7',
      });
    });

    expect(await screen.findByTestId('hidden-message')).toHaveTextContent(
      'Ce message est en cours de vérification par l’équipe'
    );
    expect(screen.queryByText('Message signalé')).not.toBeInTheDocument();
  });
});
