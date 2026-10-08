import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { WriteInvitation } from '../WriteInvitation';

interface HelpGroupInfoBlockProps {
  group: HelpGroupPage;
}

/**
 * Information block at the top of the main column, matching the situation
 * of the person: the invitation to join, or to finish the training. Nothing
 * for a member allowed to write, nor in the preview of an unpublished group.
 */
export function HelpGroupInfoBlock({ group }: HelpGroupInfoBlockProps) {
  if (!group.isPublished) {
    return null;
  }
  const { state } = group.viewerPermissions;

  if (state !== 'canWrite') {
    // The join button lives in the group header
    return (
      <WriteInvitation slug={group.slug} state={state} withJoinButton={false} />
    );
  }
  return null;
}
