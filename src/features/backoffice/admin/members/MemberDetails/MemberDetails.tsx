import React from 'react';
import { MemberUser } from '@/src/api/types';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Grid, Section, SimpleLink } from '@/src/components/ui';
import { BackLink } from '@/src/components/ui/BackLink';
import { MEMBER_TABS } from '@/src/constants';
import { useTab } from '@/src/hooks/queryParams/useTab';

import { StyledMemberTab, StyledMemberTabs } from './MemberDetails.styles';
import { MemberDetailsHeader } from './MemberDetailsHeader';
import { ParametersMemberTab } from './MemberTab';

interface MemberDetailsProps {
  user: MemberUser;
  setUser: (user: MemberUser) => void;
}

export function MemberDetails({ user, setUser }: MemberDetailsProps) {
  const tab = useTab();

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section className="custom-page">
        <Grid column gap="medium" noRowGap>
          <Grid between eachWidths={['expand@m', 'auto@m']}>
            <BackLink label="Retour" />
          </Grid>
          <MemberDetailsHeader user={user} />
          <StyledMemberTabs>
            <StyledMemberTab $active={tab === MEMBER_TABS.PARAMETERS}>
              <SimpleLink
                href={`/backoffice/admin/membres/${user.id}/parametres`}
              >
                Paramètres
              </SimpleLink>
            </StyledMemberTab>
          </StyledMemberTabs>

          {(tab === MEMBER_TABS.PARAMETERS || !tab) && (
            <ParametersMemberTab user={user} setUser={setUser} />
          )}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
}
