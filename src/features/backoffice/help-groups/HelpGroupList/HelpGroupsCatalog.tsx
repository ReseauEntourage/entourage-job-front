import React from 'react';
import { Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';
import { HelpGroupList } from './HelpGroupList';
import { StyledHelpGroupsHeader } from './HelpGroupList.styles';

export function HelpGroupsCatalog() {
  const { data: groups, isLoading } = useGetHelpGroupsQuery();

  return (
    <Section className="custom-page">
      <StyledHelpGroupsHeader>
        <H2 title="Groupes" />
      </StyledHelpGroupsHeader>
      {isLoading ? <LoadingScreen /> : <HelpGroupList groups={groups ?? []} />}
    </Section>
  );
}
