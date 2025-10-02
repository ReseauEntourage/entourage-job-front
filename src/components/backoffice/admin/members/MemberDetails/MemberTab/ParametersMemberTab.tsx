import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { EditMemberModal } from 'src/components/backoffice/admin/members/MemberDetails/EditMemberModal';
import { MemberTable } from 'src/components/backoffice/admin/members/MemberTable';
import { Member } from 'src/components/backoffice/admin/members/MemberTable/Member';
import { MemberColumn } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.types';
import { formDeleteUser } from 'src/components/forms/schemas/formDeleteUser';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Heading } from 'src/components/utils/Inputs/Heading';
import { RELATED_ROLES, UserRoles } from 'src/constants/users';
import { useMemberId } from 'src/hooks/queryParams/useMemberId';
import { useIsMobile } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import { isRoleIncluded } from 'src/utils/Finding';
import {
  StyledMemberActionsContainer,
  StyledRelatedMemberList,
} from './MemberTab.styles';

interface ParametersMemberTabProps {
  user: UserWithUserCandidate;
  setUser: (user: UserWithUserCandidate) => void;
}
export function ParametersMemberTab({
  user,
  setUser,
}: ParametersMemberTabProps) {
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const memberId = useMemberId();

  const isMobile = useIsMobile();

  const deleteUser = useCallback(
    async (fields, closeModal) => {
      try {
        if (fields.confirmation === 'SUPPRIMER') {
          await Api.deleteUser(memberId);
          closeModal();
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: "L'utilisateur a bien été supprimé",
            })
          );
          replace(
            {
              pathname: '/backoffice/admin/membres',
              query: {
                role: user.role,
              },
            },
            undefined,
            {
              shallow: true,
            }
          );
        } else {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: 'Erreur de confirmation',
            })
          );
        }
      } catch (err) {
        console.error(err);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Une erreur est survenue',
          })
        );
      }
    },
    [memberId, replace, user.role, dispatch]
  );

  const memberColumns: MemberColumn[] = useMemo(() => {
    const columnsToShow: MemberColumn[] = [
      'phone',
      'gender',
      'address',
      'zone',
      'cvUrl',
      'employed',
    ];

    if (user && isRoleIncluded([UserRoles.REFERER], user.role)) {
      return [...columnsToShow, 'organization'];
    }

    return columnsToShow;
  }, [user]);

  const referredCandidates = useMemo(() => {
    if (user) {
      if (user.referredCandidates && user.referredCandidates.length > 0) {
        return user.referredCandidates.map(({ candidat }) => {
          const userWithCandidate = candidat;
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          return userWithCandidate.candidat;
        });
      }
    }
    return null;
  }, [user]);

  const referedMembers = useMemo(() => {
    return referredCandidates?.map((member) => {
      return {
        ...member,
        organization: user.organization,
      };
    });
  }, [referredCandidates, user.organization]);

  const referedMembersList = useMemo(() => {
    return referedMembers?.map((member, key) => {
      return (
        <Member
          columns={memberColumns}
          role={RELATED_ROLES[user.role]}
          member={member}
          key={key}
        />
      );
    });
  }, [memberColumns, referedMembers, user.role]);

  return (
    <>
      <StyledMemberActionsContainer isMobile={isMobile}>
        <Button
          variant="secondary"
          rounded
          size="small"
          onClick={() => {
            openModal(
              <ModalEdit
                title="Supprimer un membre"
                description="Attention, si vous supprimer ce membre, toutes les données qui lui sont associées seront définitivement perdues. Êtes-vous sûr de vouloir continuer ?"
                submitText="Supprimer le membre"
                formSchema={formDeleteUser}
                onSubmit={deleteUser}
              />
            );
          }}
        >
          <LucidIcon name="Trash" size={15} />
          Supprimer l&apos;utilisateur
        </Button>
        <Button
          variant="secondary"
          rounded
          size="small"
          onClick={() =>
            openModal(<EditMemberModal user={user} setUser={setUser} />)
          }
        >
          <LucidIcon name="Pencil" size={15} />
          Modifier le membre
        </Button>
      </StyledMemberActionsContainer>

      <Heading
        id="user-title"
        title={`Informations du ${user.role.toLowerCase()}`}
      />
      <MemberTable
        columns={memberColumns}
        members={[
          <Member
            columns={memberColumns}
            member={user}
            role={user.role}
            isEditable
            setMember={setUser}
            disableLink
          />,
        ]}
        role={user.role}
      />

      {
        // Liste des membres liés en orienté
      }
      {referredCandidates && referredCandidates.length > 0 && (
        <StyledRelatedMemberList>
          <Heading
            id="related-user-title"
            title={`Informations des ${RELATED_ROLES[
              user.role
            ].toLowerCase()}s orientés`}
          />
          <MemberTable
            columns={memberColumns}
            members={referedMembersList || []}
            role={RELATED_ROLES[user.role]}
          />
        </StyledRelatedMemberList>
      )}
    </>
  );
}
