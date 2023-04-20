import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';
import Api from 'src/api/index.ts';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users.ts';
import { isRoleIncluded } from 'src/utils/Finding.ts';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { MemberDetails } from 'src/components/backoffice/admin/MemberDetails';
import { MEMBER_TABS } from 'src/constants';
import { useTab } from 'src/components/backoffice/admin/MemberDetails/useTab.ts';
import { useMemberId } from 'src/components/backoffice/admin/MemberDetails/useMemberId.ts';

const User = () => {
  const [user, setUser] = useState();

  const prevUser = usePrevious(user);

  const [loading, setLoading] = useState(true);

  const { replace } = useRouter();

  const memberId = useMemberId();
  const prevMemberId = usePrevious(memberId);

  const tab = useTab();
  const opportunityId = useOpportunityId();

  useEffect(() => {
    if (user !== prevUser && user) {
      if (
        isRoleIncluded(COACH_USER_ROLES, user.role) &&
        (!tab || tab !== MEMBER_TABS.PARAMETERS)
      ) {
        replace(
          `/backoffice/admin/membres/${user.id}/${MEMBER_TABS.PARAMETERS}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        if (!tab) {
          replace(`/backoffice/admin/membres/${user.id}/cv`, undefined, {
            shallow: true,
          });
        } else if (opportunityId && tab !== MEMBER_TABS.OFFERS) {
          replace(`/backoffice/admin/membres/${user.id}/${tab}`, undefined, {
            shallow: true,
          });
        }
      }
    }
  }, [opportunityId, replace, tab, prevMemberId, user, prevUser, memberId]);

  const getUser = useCallback(() => {
    Api.getUserById(memberId)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [memberId]);

  useEffect(() => {
    if (memberId !== prevMemberId) {
      getUser();
    } else if (tab === MEMBER_TABS.PARAMETERS) {
      getUser();
    }
  }, [tab, getUser, memberId, prevMemberId]);

  if (loading) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des membres">
        <Section>
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <div data-uk-spinner="" />
              <hr className="ent-divier-backoffice" />
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice" />
              <h3 className="uk-text-bold">Ce profil n’est pas disponible</h3>
              <p>
                Le lien que vous avez suivi est peut-être rompu, ou la page a
                été supprimée.
              </p>
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  return <MemberDetails user={user} setUser={setUser} />;
};

export default User;
