import React from 'react';
import { User } from 'src/api/types';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { useTab } from 'src/components/backoffice/admin/MemberDetails/useTab';
import { Grid, Icon, Section, SimpleLink } from 'src/components/utils';
import { MEMBER_TABS } from 'src/constants';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';

import { isRoleIncluded } from 'src/utils/Finding';
import { MemberDetailsHeader } from './MemberDetailsHeader';
import {
  CVMemberTab,
  OffersMemberTab,
  ParametersMemberTab,
} from './MemberTabs';
import { RecommendedOffersButton } from './RecommendedOffersButton';

interface MemberDetails {
  user: User;
  setUser: () => void;
}

export function MemberDetails({ user, setUser }: MemberDetails) {
  const tab = useTab();

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section>
        <Grid column gap="medium">
          <Grid between eachWidths={['expand@m', 'auto@m']}>
            <SimpleLink
              href={`/backoffice/admin/membres?role=${user.role}${
                user.zone ? `&zone=${user.zone}` : ''
              }`}
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <Icon name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
              <RecommendedOffersButton candidateId={user.id} />
            )}
          </Grid>
          <div>
            <MemberDetailsHeader user={user} />
            <hr className="ent-divier-backoffice uk-margin-medium-top" />
          </div>
          <ul className="uk-subnav">
            {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
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
