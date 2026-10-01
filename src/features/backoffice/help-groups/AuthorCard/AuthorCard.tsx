import React from 'react';
import { HelpGroupAuthor } from '@/src/api/types';
import { SimpleLink, Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  formatAuthorName,
  formatAuthorRoleLabel,
  getAuthorInitials,
  getProfileHref,
} from '../help-groups.labels';
import { StyledAuthorCard } from './AuthorCard.styles';

interface AuthorCardProps {
  author: HelpGroupAuthor;
}

/**
 * Card of the author of the original message. Not rendered for a deleted
 * account nor when the reader cannot view the profile.
 */
export function AuthorCard({ author }: AuthorCardProps) {
  if (author.isDeleted || !author.profileLinkable || !author.id) {
    return null;
  }
  const roleLabel = formatAuthorRoleLabel(author);

  return (
    <StyledAuthorCard aria-label="Auteur de la discussion">
      <HelpGroupAvatar
        userId={author.id}
        initials={getAuthorInitials(author)}
        size={64}
      />
      <Text weight="semibold" size="large">
        {formatAuthorName(author)}
      </Text>
      {roleLabel && <Text color="darkGray">{roleLabel}</Text>}
      {author.department && (
        <Text size="small" color="darkGray">
          {author.department}
        </Text>
      )}
      <SimpleLink href={getProfileHref(author.id)}>
        <Text color="primaryBlue" weight="semibold">
          Voir son profil
        </Text>
      </SimpleLink>
    </StyledAuthorCard>
  );
}
