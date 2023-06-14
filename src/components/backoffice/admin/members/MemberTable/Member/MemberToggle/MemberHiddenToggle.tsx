import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';

interface MemberHiddenToggleProps {
  member: UserWithUserCandidate;
  setMember?: (user: UserWithUserCandidate) => void;
}
export function MemberHiddenToggle({
  member,
  setMember,
}: MemberHiddenToggleProps) {
  return (
    <ToggleWithConfirmationModal
      id={`hidden-${member.id}`}
      modalTitle="Changer la visibilité du CV en ligne ?"
      modalConfirmation="Oui, masquer le CV"
      defaultValue={member.candidat.hidden}
      onToggle={async (hidden) => {
        try {
          await Api.putCandidate(member.id, {
            hidden,
          });

          if (setMember) {
            setMember({
              ...member,
              candidat: {
                ...member.candidat,
                hidden,
              },
            });
          }
          UIkit.notification(
            hidden
              ? 'Le CV est désormais masqué'
              : 'Le CV est désormais visible',
            'success'
          );
        } catch (err) {
          console.error(err);
          UIkit.notification(
            'Une erreur est survenue lors du masquage du profil',
            'danger'
          );
        }
      }}
    />
  );
}
