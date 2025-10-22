import React, { useCallback, useEffect, useState } from 'react';
import { Api } from 'src/api';
import { User as UserType } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { MemberDetails } from 'src/components/backoffice/admin/members/MemberDetails';
import { Grid, Section } from 'src/components/utils';
import { BackLink } from 'src/components/utils/BackLink';
import { MEMBER_TABS } from 'src/constants';
import { useMemberId } from 'src/hooks/queryParams/useMemberId';
import { useTab } from 'src/hooks/queryParams/useTab';
import { usePrevious } from 'src/hooks/utils';

const User = () => {
  const [user, setUser] = useState<UserType>();

  const [loading, setLoading] = useState(true);

  const memberId = useMemberId();
  const prevMemberId = usePrevious(memberId);

  const tab = useTab();

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
            <BackLink label="Retour" />
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
            <BackLink label="Retour" />
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
