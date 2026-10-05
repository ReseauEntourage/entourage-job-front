/**
 * Unpublished texts of the help groups, kept in the browser per person:
 * `help-groups:draft:<userId>:group:<groupId>` (a discussion being written)
 * and `help-groups:draft:<userId>:discussion:<discussionId>` (a reply).
 * Every storage access is guarded: `localStorage` throws in some private
 * browsing modes, where drafts are then simply not kept.
 */
export const HELP_GROUPS_DRAFT_PREFIX = 'help-groups:draft:';

// Incremented by each purge (logout): a write recorded before it, still
// pending in a mounted composer, must never bring a draft back
let draftsGeneration = 0;

export const getHelpGroupDraftsGeneration = () => draftsGeneration;

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

export const writeHelpGroupDraft = <T>(
  key: string,
  value: T | null,
  // Generation at which the value was typed: stale after a purge
  generation: number = draftsGeneration
) => {
  if (generation !== draftsGeneration) {
    return;
  }
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
  draftsGeneration += 1;
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
