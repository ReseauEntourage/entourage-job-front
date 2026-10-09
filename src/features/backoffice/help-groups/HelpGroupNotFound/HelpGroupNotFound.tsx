import React from 'react';
import { Section, SimpleLink, Text } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { StyledHelpGroupNotFound } from './HelpGroupNotFound.styles';

/**
 * Shown for an unpublished, deleted or unknown group or discussion (the API
 * answers 404, never 403).
 */
export function HelpGroupNotFound() {
  return (
    <Section className="custom-page">
      <StyledHelpGroupNotFound>
        <H3 title="Page introuvable" center />
        <Text color="darkGray" center>
          La page que vous avez demandée est malheureusement introuvable.
        </Text>
        <SimpleLink href="/backoffice/groupes">
          <Text color="primaryBlue" weight="semibold">
            Voir les groupes
          </Text>
        </SimpleLink>
      </StyledHelpGroupNotFound>
    </Section>
  );
}
