import React from 'react';
import { HelpGroupAuthor as HelpGroupAuthorType } from '@/src/api/types';
import { SimpleLink, Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  formatAuthorName,
  formatAuthorRoleLabel,
  formatHelpGroupDate,
  getAuthorAvatarUser,
  getProfileHref,
} from '../help-groups.labels';
import {
  StyledHelpGroupAuthor,
  StyledHelpGroupAuthorRole,
} from './HelpGroupAuthor.styles';

interface HelpGroupAuthorProps {
  author: HelpGroupAuthorType;
  date?: string;
  withAvatar?: boolean;
  // Profile picture of the author, when known (the members list)
  hasPicture?: boolean;
}

/**
 * "Julien P." followed by its role label. The name links to the profile only
 * when the reader can view it. A deleted account reads "Utilisateur
 * supprimé", without role label, initials nor link.
 */
export function HelpGroupAuthor({
  author,
  date,
  withAvatar = true,
  hasPicture = false,
}: HelpGroupAuthorProps) {
  const name = formatAuthorName(author);
  const roleLabel = formatAuthorRoleLabel(author);
  const isLinkable = !author.isDeleted && author.profileLinkable && author.id;

  return (
    <StyledHelpGroupAuthor>
      {withAvatar && (
        <HelpGroupAvatar
          user={getAuthorAvatarUser(author)}
          hasPicture={hasPicture}
        />
      )}
      {isLinkable ? (
        <SimpleLink href={getProfileHref(author.id as string)}>
          <Text weight="semibold">{name}</Text>
        </SimpleLink>
      ) : (
        <Text weight="semibold">{name}</Text>
      )}
      {roleLabel && (
        <StyledHelpGroupAuthorRole>{roleLabel}</StyledHelpGroupAuthorRole>
      )}
      {date && (
        <Text size="small" color="darkGray">
          {formatHelpGroupDate(date)}
        </Text>
      )}
    </StyledHelpGroupAuthor>
  );
}
