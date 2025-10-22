import React from 'react';
import { User } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { MEMBER_TABS } from 'src/constants';
import { useTab } from 'src/hooks/queryParams/useTab';

import { MemberDetailsHeader } from './MemberDetailsHeader';
import { ParametersMemberTab } from './MemberTab';

interface MemberDetailsProps {
  user: User;
  setUser: (user: User) => void;
}

export function MemberDetails({ user, setUser }: MemberDetailsProps) {
  const tab = useTab();

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section className="custom-page">
        <Grid column gap="medium">
          <Grid between eachWidths={['expand@m', 'auto@m']}>
            <BackLink label="Retour" />
          </Grid>
          <MemberDetailsHeader user={user} />
          <ul className="uk-subnav">
            <li className={tab === MEMBER_TABS.PARAMETERS ? 'uk-active' : ''}>
              <SimpleLink
                href={`/backoffice/admin/membres/${user.id}/parametres`}
              >
                Paramètres
              </SimpleLink>
            </li>
          </ul>

          {(tab === MEMBER_TABS.PARAMETERS || !tab) && (
            <ParametersMemberTab user={user} setUser={setUser} />
          )}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
}
