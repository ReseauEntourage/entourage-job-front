// Beyond this number of replies pages (500 replies), the discussion opens on
// top of the original message instead of loading more pages
export const MAX_REPLY_TARGET_PAGES = 10;

export type ReplyTargetState = 'none' | 'found' | 'loadMore' | 'notFound';

/**
 * Where the view must go when the address designates a reply (`?replyId=`):
 * - `found`: the reply is loaded, scroll to it and highlight it,
 * - `loadMore`: not loaded yet, load the next replies page,
 * - `notFound`: deleted, unknown or beyond the pages cap, open on top of the
 *   original message,
 * - `none`: no designated reply, open on top of the original message.
 */
export const getReplyTargetState = ({
  replyId,
  loadedReplyIds,
  loadedPagesCount,
  hasNextPage,
  maxPages = MAX_REPLY_TARGET_PAGES,
}: {
  replyId: string | null;
  loadedReplyIds: string[];
  loadedPagesCount: number;
  hasNextPage: boolean;
  maxPages?: number;
}): ReplyTargetState => {
  if (!replyId) {
    return 'none';
  }
  if (loadedReplyIds.includes(replyId)) {
    return 'found';
  }
  if (hasNextPage && loadedPagesCount < maxPages) {
    return 'loadMore';
  }
  return 'notFound';
};

export const getReplyElementId = (replyId: string) => `reply-${replyId}`;
