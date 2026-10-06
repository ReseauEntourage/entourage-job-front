import React, { useEffect } from 'react';
import { Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { useLazyGetHelpGroupMessageRevisionsQuery } from '@/src/use-cases/help-groups';
import { REVISIONS_MODAL } from '../help-groups-participation.labels';
import { formatHelpGroupDateTime } from '../help-groups.labels';
import { StyledRevision, StyledRevisions } from './ModerationModals.styles';

interface RevisionsModalProps {
  kind: 'discussions' | 'replies';
  id: string;
}

/**
 * Previous versions of an edited message, for the Entourage admins: the
 * current version first, then the previous ones from the most recent.
 */
export function RevisionsModal({ kind, id }: RevisionsModalProps) {
  const [fetchRevisions, { data, isLoading, isError }] =
    useLazyGetHelpGroupMessageRevisionsQuery();

  useEffect(() => {
    fetchRevisions({ kind, id });
  }, [fetchRevisions, kind, id]);

  return (
    <ModalGeneric title={REVISIONS_MODAL.title} align="left">
      {isLoading && <Spinner />}
      {isError && <Text color="lightRed">{REVISIONS_MODAL.error}</Text>}
      {data && (
        <StyledRevisions data-testid="message-revisions">
          {[
            {
              key: 'current',
              label: `${REVISIONS_MODAL.current} · ${formatHelpGroupDateTime(
                data.current.date
              )}`,
              title: data.current.title,
              content: data.current.content,
            },
            ...data.previous.map((revision) => ({
              key: revision.id,
              label: formatHelpGroupDateTime(revision.createdAt),
              title: revision.title,
              content: revision.content,
            })),
          ].map(({ key, label, title, content }) => (
            <StyledRevision key={key} data-testid="message-revision">
              <Text size="small" color="darkGray">
                {label}
              </Text>
              {title && <Text weight="semibold">{title}</Text>}
              <Text>{content}</Text>
            </StyledRevision>
          ))}
        </StyledRevisions>
      )}
    </ModalGeneric>
  );
}
