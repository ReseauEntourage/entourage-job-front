import {
  HelpGroupAuthor,
  HelpGroupCard,
  HelpGroupDiscussion,
  HelpGroupDiscussionItem,
  HelpGroupHiddenDiscussion,
  HelpGroupHiddenMessage,
  HelpGroupPage,
  HelpGroupReply,
} from '@/src/api/types';

export const buildAuthor = (
  props: Partial<HelpGroupAuthor> = {}
): HelpGroupAuthor => ({
  id: 'author-1',
  firstName: 'Amina',
  lastNameInitial: 'L.',
  roleLabel: 'Coach',
  isDeleted: false,
  isAdmin: false,
  profileLinkable: true,
  ...props,
});

export const deletedAuthor: HelpGroupAuthor = {
  id: 'deleted-1',
  firstName: null,
  lastNameInitial: null,
  roleLabel: null,
  isDeleted: true,
  isAdmin: false,
  profileLinkable: false,
};

export const buildCard = (
  props: Partial<HelpGroupCard> = {}
): HelpGroupCard => ({
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Échanger sur la rédaction de son CV',
  membersCount: 128,
  isMember: false,
  recentContributors: [],
  pinnedAt: null,
  ...props,
});

export const buildDiscussionItem = (
  props: Partial<HelpGroupDiscussionItem> = {}
): HelpGroupDiscussionItem => ({
  id: 'discussion-1',
  title: 'Comment présenter un trou dans mon CV ?',
  createdAt: '2026-09-01T10:00:00.000Z',
  lastActivityAt: '2026-09-02T10:00:00.000Z',
  author: buildAuthor(),
  repliesCount: 0,
  reactionsSummary: null,
  isUnderReview: false,
  ...props,
});

export const buildDiscussion = (
  props: Partial<HelpGroupDiscussion> = {}
): HelpGroupDiscussion => ({
  ...buildDiscussionItem(),
  content: 'Bonjour à tous',
  editedAt: null,
  viewerReaction: null,
  group: {
    id: 'group-1',
    slug: 'refaire-un-cv',
    name: 'Refaire un CV',
    isPublished: true,
  },
  ...props,
});

export const buildReply = (
  props: Partial<HelpGroupReply> = {}
): HelpGroupReply => ({
  id: 'reply-1',
  content: 'Une réponse',
  createdAt: '2026-09-02T10:00:00.000Z',
  editedAt: null,
  author: buildAuthor(),
  reactionsSummary: null,
  viewerReaction: null,
  isUnderReview: false,
  ...props,
});

export const buildHiddenReply = (
  id = 'reply-hidden'
): HelpGroupHiddenMessage => ({
  id,
  isUnderReview: true,
});

export const buildHiddenDiscussion = (
  props: Partial<HelpGroupHiddenDiscussion> = {}
): HelpGroupHiddenDiscussion => ({
  id: 'discussion-1',
  isUnderReview: true,
  repliesCount: 0,
  group: buildDiscussion().group,
  ...props,
});

export const buildGroupPage = (
  props: Partial<HelpGroupPage> = {}
): HelpGroupPage => ({
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Échanger sur la rédaction de son CV',
  membersCount: 128,
  isMember: true,
  emailsEnabled: true,
  isPublished: true,
  viewerPermissions: {
    state: 'canWrite',
    charterAccepted: true,
    showWelcomeInvite: false,
  },
  ...props,
});
