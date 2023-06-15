import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuid } from 'uuid';
import { UserWithUserCandidate } from 'src/api/types';
import { MemberTable } from 'src/components/backoffice/admin/members/MemberTable';
import { Member } from 'src/components/backoffice/admin/members/MemberTable/Member';
import { MemberColumn } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.types';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { UserContext } from 'src/store/UserProvider';

const uuidValue = uuid();

export const ExternalCoachMemberList = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<UserWithUserCandidate[]>([]);

  const memberColumns: MemberColumn[] = useMemo(
    () => ['employed', 'cvStatus', 'employed', 'cvHidden'],
    []
  );

  useEffect(() => {
    if (user) {
      const relatedUsers = user.coaches.map((relatedUser) => {
        const { candidat, ...relatedUserWithoutCandidate } = relatedUser;
        return {
          ...candidat,
          candidat: relatedUserWithoutCandidate,
        };
      });
      setMembers(relatedUsers);
      setLoading(false);
    }
  }, [user]);

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
