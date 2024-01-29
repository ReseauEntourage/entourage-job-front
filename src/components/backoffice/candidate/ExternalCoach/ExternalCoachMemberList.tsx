import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { MemberTable } from 'src/components/backoffice/admin/members/MemberTable';
import { Member } from 'src/components/backoffice/admin/members/MemberTable/Member';
import { MemberColumn } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.types';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

const uuidValue = uuid();

export const ExternalCoachMemberList = () => {
  const user = useAuthenticatedUser();

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<UserWithUserCandidate[]>([]);

  const memberColumns: MemberColumn[] = useMemo(
    () => ['employed', 'cvStatus', 'employed', 'cvHidden'],
    []
  );

  useEffect(() => {
    const getRelatedUsers = async () => {
      const relatedUsersPromises = user.coaches
        ? user.coaches.map(async (relatedUser) => {
            const { candidat, ...relatedUserWithoutCandidate } = relatedUser;
            try {
              const response = await Api.getCVByCandidateId(candidat?.id);
              return {
                ...candidat,
                candidat: {
                  ...relatedUserWithoutCandidate,
                  cvs: [response.data],
                },
              };
            } catch (err) {
              console.error(err);
            }
          })
        : [];
      const membersData = (await Promise.all(
        relatedUsersPromises
      )) as UserWithUserCandidate[];
      setMembers(membersData);

      setLoading(false);
    };
    getRelatedUsers();
  }, [user.coaches]);

  const updateMembers = useCallback(
    (newUser: UserWithUserCandidate) => {
      const newList = members.map((userCandidate) => {
        if (userCandidate.id === newUser.id) {
          return newUser;
        }
        return userCandidate;
      });
      setMembers(newList);
    },
    [members, setMembers]
  );

  const memberList = useMemo(() => {
    return members?.map((member, k) => {
      return (
        <Member
          columns={memberColumns}
          role="Candidat"
          member={member}
          key={`${k}-${uuidValue}`}
          isEditable
          setMember={updateMembers}
        />
      );
    });
  }, [memberColumns, members, updateMembers]);

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
