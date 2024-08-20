import React from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { notificationsActions } from 'src/use-cases/notifications';

interface MemberHiddenToggleProps {
  member: UserWithUserCandidate;
  setMember?: (user: UserWithUserCandidate) => void;
}
export function MemberHiddenToggle({
  member,
  setMember,
}: MemberHiddenToggleProps) {
  const dispatch = useDispatch();
  return (
    <ToggleWithModal
      id={`hidden-${member.id}`}
      modal={{
        title: 'Changer la visibilité du CV en ligne ?',
        confirmationText: 'Oui, masquer le CV',
      }}
      isToggled={!!member?.candidat?.hidden}
      onToggle={async (hidden) => {
        try {
          await Api.putCandidate(member.id, {
            hidden,
          });

          if (setMember) {
            setMember({
              ...member,

              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              candidat: {
                ...member.candidat,
                hidden,
              },
            });
          }
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: hidden
                ? 'Le CV est désormais masqué'
                : 'Le CV est désormais visible',
            })
          );
        } catch (err) {
          console.error(err);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: 'Une erreur est survenue lors du masquage du profil',
            })
          );
        }
      }}
    />
  );
}
