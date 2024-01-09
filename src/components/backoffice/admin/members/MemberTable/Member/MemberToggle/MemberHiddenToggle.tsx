import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';

interface MemberHiddenToggleProps {
  member: UserWithUserCandidate;
  setMember?: (user: UserWithUserCandidate) => void;
}
export function MemberHiddenToggle({
  member,
  setMember,
}: MemberHiddenToggleProps) {
  return (
    <ToggleWithModal
      id={`hidden-${member.id}`}
      title=""
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
