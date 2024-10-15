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
import {
  EXTERNAL_USER_ROLES,
  RELATED_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { useMemberId } from 'src/hooks/queryParams/useMemberId';
import { useIsMobile } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import { getRelatedUser, isRoleIncluded } from 'src/utils/Finding';
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
      'cvHidden',
    ];

    if (user && isRoleIncluded(EXTERNAL_USER_ROLES, user.role)) {
      return [...columnsToShow, 'organization'];
    }

    return columnsToShow;
  }, [user]);

  const relatedUser = getRelatedUser(user);

  const pluralForm = relatedUser && relatedUser.length > 1 ? 's' : '';
  const externalCoachTitle = `des candidat${pluralForm} externe${pluralForm}`;

  const relatedMembers = useMemo(() => {
    return relatedUser?.map((member) => {
      return {
        ...member,
        candidat:
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          user.coaches.find(({ candidat: { id } }) => member.id === id),
        coaches: user.candidat ? [user.candidat] : [],
        organization: user.organization,
      };
    });
  }, [relatedUser, user.candidat, user.coaches, user.organization]);

  const relatedMemberList = useMemo(() => {
    return relatedMembers?.map((member, key) => {
      return (
        <Member
          columns={memberColumns}
          role={RELATED_ROLES[user.role]}
          member={member}
          key={key}
        />
      );
    });
  }, [memberColumns, relatedMembers, user.role]);

  return (
    <>
      <StyledMemberActionsContainer isMobile={isMobile}>
        <Button
          style="custom-secondary"
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
          style="custom-secondary"
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
        title={`Information du ${user.role.toLowerCase()}`}
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
      {relatedMemberList && relatedMemberList.length > 0 && (
        <StyledRelatedMemberList>
          <Heading
            id="related-user-title"
            title={`Information ${
              user.role === USER_ROLES.COACH_EXTERNAL
                ? externalCoachTitle
                : `du ${RELATED_ROLES[user.role].toLowerCase()}`
            } `}
          />
          <MemberTable
            columns={memberColumns}
            members={relatedMemberList}
            role={RELATED_ROLES[user.role]}
          />
        </StyledRelatedMemberList>
      )}
    </>
  );
}
