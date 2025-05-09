import React from 'react';
import { User } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { MEMBER_TABS } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useTab } from 'src/hooks/queryParams/useTab';

import { MemberDetailsHeader } from './MemberDetailsHeader';
import { CVMemberTab, ParametersMemberTab } from './MemberTab';

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
            <BackLink
              url={`/backoffice/admin/membres?role=${user.role}${
                user.zone ? `&zone=${user.zone}` : ''
              }`}
              label="Retour à la liste"
            />
          </Grid>
          <MemberDetailsHeader user={user} />
          <ul className="uk-subnav">
            {user.role === UserRoles.CANDIDATE && (
              <>
                <li className={tab === MEMBER_TABS.CV ? 'uk-active' : ''}>
                  <SimpleLink href={`/backoffice/admin/membres/${user.id}/cv`}>
                    CV
                  </SimpleLink>
                </li>
              </>
            )}
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
          {tab === MEMBER_TABS.CV && <CVMemberTab candidateId={user.id} />}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
}
