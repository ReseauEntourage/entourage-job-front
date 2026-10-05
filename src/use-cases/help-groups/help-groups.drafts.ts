/**
 * Unpublished texts of the help groups, kept in the browser per person:
 * `help-groups:draft:<userId>:group:<groupId>` (a discussion being written)
 * and `help-groups:draft:<userId>:discussion:<discussionId>` (a reply).
 * Every storage access is guarded: `localStorage` throws in some private
 * browsing modes, where drafts are then simply not kept.
 */
export const HELP_GROUPS_DRAFT_PREFIX = 'help-groups:draft:';

export const getHelpGroupDraftKey = (
  userId: string,
  scope: 'group' | 'discussion',
  id: string
) => `${HELP_GROUPS_DRAFT_PREFIX}${userId}:${scope}:${id}`;

export const readHelpGroupDraft = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const writeHelpGroupDraft = <T>(key: string, value: T | null) => {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage unavailable: the draft is not kept
  }
};

/**
 * Removes every help groups draft, of any person (shared computer).
 */
export const purgeHelpGroupDrafts = () => {
  try {
    const keys: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(HELP_GROUPS_DRAFT_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Storage unavailable: nothing was kept
  }
};
