import React from 'react';
import UIkit from 'uikit';
import { useUpdateUser } from '../../useUpdateUser';
import { Api } from 'src/api';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import { Card } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledCVPreferenceLine } from './CVPreferencesCard.styles';

export const CVPreferencesCard = () => {
  const user = useAuthenticatedUser();
  const { updateUser } = useUpdateUser(user);

  if (!user.candidat) return null;

  return (
    <Card title="Préférences du CV" isMobileClosable>
      <StyledCVPreferenceLine>
        <CandidateEmployedToggle
          title="J'ai retrouvé un emploi"
          modalTitle="Vous avez retrouvé un emploi ?"
          modalConfirmation="Valider"
          defaultValue={user?.candidat?.employed}
          candidateId={user.id}
          notificationMessage="Votre profil a été mis à jour !"
          subtitle={
            user &&
            user.candidat && (
              <ContractLabel
                contract={user.candidat.contract}
                endOfContract={user.candidat.endOfContract}
              />
            )
          }
          setData={(newData) => {
            updateUser({
              ...user,
              candidat: user.candidat
                ? {
                    ...user.candidat,
                    ...newData,
                  }
                : undefined,
            });
          }}
        />
      </StyledCVPreferenceLine>
      <StyledCVPreferenceLine>
        <ToggleWithConfirmationModal
          id="hidden"
          title="Masquer mon CV"
          modalTitle="Changer la visibilité du CV en ligne ?"
          modalDescription={
            <>
              En masquant votre CV de LinkedOut, il ne sera plus visible par les
              utilisateurs du site.
              <br />
              Vous pourrez le remettre en ligne à tout moment.
            </>
          }
          modalConfirmation="Oui, masquer mon CV"
          defaultValue={user?.candidat?.hidden}
          onToggle={(hidden) => {
            return Api.putCandidate(user.id, {
              hidden,
            })
              .then(() => {
                updateUser({
                  ...user,
                  candidat: user.candidat
                    ? {
                        ...user.candidat,
                        hidden,
                      }
                    : undefined,
                });
                UIkit.notification(
                  hidden
                    ? 'Votre CV est désormais masqué'
                    : 'Votre CV est désormais visible',
                  'success'
                );
              })
              .catch(() => {
                return UIkit.notification(
                  'Une erreur est survenue lors du masquage de votre profil',
                  'danger'
                );
              });
          }}
        />
      </StyledCVPreferenceLine>
    </Card>
  );
};
