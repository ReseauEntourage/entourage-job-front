import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { WelcomeInvite } from '../WelcomeInvite';
import { WriteInvitation } from '../WriteInvitation';

interface HelpGroupInfoBlockProps {
  group: HelpGroupPage;
  firstName?: string;
  onWelcomeClick: () => void;
}

/**
 * Information block at the top of the main column, matching the situation
 * of the person: the invitation to join, or to finish the training, or for a new
 * member the invitation to introduce themselves. Nothing otherwise, nor in
 * the preview of an unpublished group.
 */
export function HelpGroupInfoBlock({
  group,
  firstName,
  onWelcomeClick,
}: HelpGroupInfoBlockProps) {
  if (!group.isPublished) {
    return null;
  }
  const { state, showWelcomeInvite } = group.viewerPermissions;

  if (state !== 'canWrite') {
    // The join button lives in the group header
    return (
      <WriteInvitation slug={group.slug} state={state} withJoinButton={false} />
    );
  }
  if (showWelcomeInvite && firstName) {
    return <WelcomeInvite firstName={firstName} onClick={onWelcomeClick} />;
  }
  return null;
}
