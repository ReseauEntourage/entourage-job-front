import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import { Card } from 'src/components/utils';
import { StyledCVPreferenceLine } from './CVPreferences.styles';

export const CVPreferences = ({
  userData,
  setUserData,
}: {
  userData: UserWithUserCandidate;
  setUserData: React.Dispatch<
    React.SetStateAction<UserWithUserCandidate | undefined>
  >;
}) => {
  return (
    <Card title="Préférences du CV">
      <StyledCVPreferenceLine>
        <CandidateEmployedToggle
          title="J'ai retrouvé un emploi"
          modalTitle="Vous avez retrouvé un emploi ?"
          modalConfirmation="Valider"
          defaultValue={userData?.candidat?.employed}
          candidateId={userData.id}
          notificationMessage="Votre profil a été mis à jour !"
          subtitle={
            userData &&
            userData.candidat && (
              <ContractLabel
                contract={userData.candidat.contract}
                endOfContract={userData.candidat.endOfContract}
              />
            )
          }
          setData={(newData) => {
            setUserData({
              ...userData,
              candidat: userData.candidat
                ? {
                    ...userData.candidat,
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
          defaultValue={userData?.candidat?.hidden}
          onToggle={(hidden) => {
            return Api.putCandidate(userData.id, {
              hidden,
            })
              .then(() => {
                setUserData({
                  ...userData,
                  candidat: userData.candidat
                    ? {
                        ...userData.candidat,
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
