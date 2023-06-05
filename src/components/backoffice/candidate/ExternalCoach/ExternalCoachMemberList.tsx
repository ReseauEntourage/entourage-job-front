import React, { useState, useMemo, useEffect, useContext } from 'react';
import { MemberTable } from 'src/components/backoffice/admin/members/MemberTable';
import { Member } from 'src/components/backoffice/admin/members/MemberTable/Member';
import { MemberColumn } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.types';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { UserContext } from 'src/store/UserProvider';
import { getRelatedUser } from 'src/utils/Finding';

export const ExternalCoachMemberList = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const memberColumns: MemberColumn[] = useMemo(
    () => ['employed', 'cvStatus'],
    []
  );

  useEffect(() => {
    if (user) {
      const relatedUsers = getRelatedUser(user);
      setMembers(relatedUsers);
      setLoading(false);
    }
  }, [user]);

  const memberList = useMemo(() => {
    return members?.map((member, key) => {
      return (
        <Member
          columns={memberColumns}
          role="Candidat"
          member={{ ...member, role: 'Candidat' }}
          key={key}
        />
      );
    });
  }, [memberColumns, members]);

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && members?.length > 0 ? (
        <MemberTable
          columns={memberColumns}
          members={memberList}
          role="Candidat"
        />
      ) : (
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-text-center">
            <span className="uk-text-primary">Aucun candidat</span> n&apos;est
            rattaché à ce compte.
          </h2>
          <p className="uk-text-center">
            Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
            LinkedOut pour en savoir plus.
          </p>
        </div>
      )}
    </div>
  );
};
