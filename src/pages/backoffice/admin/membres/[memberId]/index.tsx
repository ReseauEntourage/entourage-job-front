import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Api } from 'src/api';
import { User as UserType } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { MemberDetails } from 'src/components/backoffice/admin/members/MemberDetails';
import { Grid, Section } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { MEMBER_TABS } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useMemberId } from 'src/hooks/queryParams/useMemberId';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useTab } from 'src/hooks/queryParams/useTab';
import { usePrevious } from 'src/hooks/utils';

const User = () => {
  const [user, setUser] = useState<UserType>();

  const prevUser = usePrevious(user);

  const [loading, setLoading] = useState(true);

  const { replace } = useRouter();

  const memberId = useMemberId();
  const prevMemberId = usePrevious(memberId);

  const tab = useTab();
  const opportunityId = useOpportunityId();

  useEffect(() => {
    if (user && user !== prevUser) {
      if (
        user.role === USER_ROLES.COACH &&
        (!tab || tab !== MEMBER_TABS.PARAMETERS)
      ) {
        replace(
          `/backoffice/admin/membres/${user.id}/${MEMBER_TABS.PARAMETERS}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (user.role === USER_ROLES.CANDIDATE) {
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
            <BackLink
              url="/backoffice/admin/membres"
              label="Retour à la liste"
            />
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
            <BackLink
              url="/backoffice/admin/membres"
              label="Retour à la liste"
            />
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
