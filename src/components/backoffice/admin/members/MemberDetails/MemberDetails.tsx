import React from 'react';
import { User } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { MEMBER_TABS } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useTab } from 'src/hooks/queryParams/useTab';

import { MemberDetailsHeader } from './MemberDetailsHeader';
import { CVMemberTab, OffersMemberTab, ParametersMemberTab } from './MemberTab';
import { RecommendedOffersButton } from './RecommendedOffersButton';

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
            {user.role === USER_ROLES.CANDIDATE && (
              <RecommendedOffersButton candidateId={user.id} />
            )}
          </Grid>
          <MemberDetailsHeader user={user} />
          <ul className="uk-subnav">
            {user.role === USER_ROLES.CANDIDATE && (
              <>
                <li className={tab === MEMBER_TABS.CV ? 'uk-active' : ''}>
                  <SimpleLink href={`/backoffice/admin/membres/${user.id}/cv`}>
                    CV
                  </SimpleLink>
                </li>
                <li className={tab === MEMBER_TABS.OFFERS ? 'uk-active' : ''}>
                  <SimpleLink
                    href={`/backoffice/admin/membres/${user.id}/offres`}
                  >
                    Opportunités
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

          {/* tab CV and tab OFFERS are only accessible when user is a candidate */}
          {tab === MEMBER_TABS.PARAMETERS && (
            <ParametersMemberTab user={user} setUser={setUser} />
          )}
          {tab === MEMBER_TABS.CV && <CVMemberTab candidateId={user.id} />}
          {tab === MEMBER_TABS.OFFERS && (
            <OffersMemberTab candidateId={user.id} />
          )}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
}
