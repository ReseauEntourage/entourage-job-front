import React from 'react';
import { HelpGroupPage } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { EmailsSetting } from '../EmailsSetting';
import { HelpGroupContent } from '../HelpGroupContent';
import { MembershipActions } from '../MembershipActions';
import { JoinHelpGroupButton } from '../WriteInvitation';
import {
  ABOUT_GROUP_TITLE,
  PUBLISH_DISCUSSION_LABEL,
} from '../help-groups-participation.labels';
import { StyledHelpGroupAbout } from './HelpGroupPage.styles';

interface HelpGroupAboutProps {
  group: HelpGroupPage;
  justJoined: boolean;
  highlightEmails: boolean;
  onJoined: () => void;
  onPublish: () => void;
}

/**
 * « À propos de ce groupe »: the full description, then the main action
 * matching the situation (join, or publish a discussion), with leaving the
 * group as a secondary action. No action at all for a person who has not
 * finished the training, nor in the preview of an unpublished group.
 */
export function HelpGroupAbout({
  group,
  justJoined,
  highlightEmails,
  onJoined,
  onPublish,
}: HelpGroupAboutProps) {
  const { state } = group.viewerPermissions;

  return (
    <StyledHelpGroupAbout
      aria-label={ABOUT_GROUP_TITLE}
      data-testid="help-group-about"
    >
      <H5 title={ABOUT_GROUP_TITLE} noMarginBottom />
      <HelpGroupContent content={group.description} />
      {group.isPublished && state === 'mustJoin' && (
        <JoinHelpGroupButton slug={group.slug} onJoined={onJoined} />
      )}
      {group.isPublished && state === 'canWrite' && (
        <>
          <Button
            variant="primary"
            onClick={onPublish}
            dataTestId="publish-discussion"
          >
            {PUBLISH_DISCUSSION_LABEL}
          </Button>
          <MembershipActions slug={group.slug} justJoined={justJoined} />
        </>
      )}
      {/* Members only, whatever their write state */}
      {group.isMember && typeof group.emailsEnabled === 'boolean' && (
        <EmailsSetting
          slug={group.slug}
          emailsEnabled={group.emailsEnabled}
          isHighlighted={highlightEmails}
        />
      )}
    </StyledHelpGroupAbout>
  );
}
