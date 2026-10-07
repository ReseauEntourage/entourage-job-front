import React from 'react';
import { HelpGroupAuthor } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '../HelpGroupAvatar';
import {
  formatAuthorName,
  formatAuthorRoleLabel,
  getAuthorInitials,
  getProfileHref,
} from '../help-groups.labels';
import {
  StyledAuthorCard,
  StyledAuthorCardIdentity,
  StyledAuthorCardLink,
} from './AuthorCard.styles';

interface AuthorCardProps {
  author: HelpGroupAuthor;
}

/**
 * Card of the author of the original message, next to the discussion on
 * desktop. Not rendered for a deleted account nor when the reader cannot
 * view the profile.
 */
export function AuthorCard({ author }: AuthorCardProps) {
  if (author.isDeleted || !author.profileLinkable || !author.id) {
    return null;
  }
  const details = [formatAuthorRoleLabel(author), author.department]
    .filter(Boolean)
    .join(' · ');

  return (
    <StyledAuthorCard aria-label="Auteur de la discussion">
      <HelpGroupAvatar
        userId={author.id}
        initials={getAuthorInitials(author)}
        size={56}
      />
      <StyledAuthorCardIdentity>
        <Text weight="semibold">{formatAuthorName(author)}</Text>
        {details && (
          <Text size="small" color="darkGray">
            {details}
          </Text>
        )}
      </StyledAuthorCardIdentity>
      <StyledAuthorCardLink>
        <Button
          variant="secondary"
          size="small"
          href={getProfileHref(author.id)}
        >
          Voir son profil
        </Button>
      </StyledAuthorCardLink>
    </StyledAuthorCard>
  );
}
