import { useRouter } from 'next/router';
import React from 'react';
import UIkit from 'uikit';
import { EditMemberModal } from '../EditMemberModal';
import Api from 'src/api';
import { User } from 'src/api/types';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';
import { useMemberId } from 'src/components/backoffice/admin/MemberDetails/useMemberId';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import UserInformationCard from 'src/components/cards/UserInformationCard';
import schemaDeleteUser from 'src/components/forms/schema/formDeleteUser.json';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button, Card, Grid, Icon } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';

interface ParametersMemberTabProps {
  user: User;
  setUser: (user: User) => void;
}
export function ParametersMemberTab({
  user,
  setUser,
}: ParametersMemberTabProps) {
  const { replace } = useRouter();
  const memberId = useMemberId();
  const deleteUser = async (fields, closeModal) => {
    try {
      if (fields.confirmation === 'SUPPRIMER') {
        await Api.deleteUser(memberId);
        closeModal();
        UIkit.notification("L'utilisateur a bien été supprimé", 'success');
        replace('/backoffice/admin/membres');
      } else {
        UIkit.notification('Erreur de confirmation', 'danger');
      }
    } catch {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  };

  const isCandidat =
    user && user.candidat && isRoleIncluded(CANDIDATE_USER_ROLES, user.role);

  return (
    <Grid childWidths={['1-2@m']}>
      <Grid gap={isCandidat ? 'medium' : 'collapse'} childWidths={['1-1']}>
        <div>
          {isCandidat && (
            <Card title="Préférences du CV">
              <CandidateEmployedToggle
                title="A retrouvé un emploi"
                modalTitle="Le candidat a retrouvé un emploi ?"
                modalConfirmation="Valider"
                defaultValue={user.candidat.employed}
                notificationMessage="Le profil du candidat a été mis à jour !"
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
                  setUser({
                    ...user,
                    candidat: {
                      ...user.candidat,
                      ...newData,
                    },
                  });
                }}
                candidateId={user.id}
              />
              <ToggleWithConfirmationModal
                id="hidden"
                title="Masquer le CV"
                modalTitle="Changer la visibilité du CV en ligne ?"
                modalConfirmation="Oui, masquer le CV"
                defaultValue={user.candidat.hidden}
                onToggle={async (hidden) => {
                  try {
                    await Api.putCandidate(user.id, {
                      hidden,
                    });

                    setUser({
                      ...user,
                      candidat: {
                        ...user.candidat,
                        hidden,
                      },
                    });
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
            </Card>
          )}
        </div>
        <div className="uk-card uk-card-default uk-card-body">
          <Grid gap="small" between eachWidths={['expand', 'auto']}>
            <h3 className="uk-card-title">Informations personnelles</h3>
            <ButtonIcon
              name="pencil"
              onClick={() => {
                openModal(<EditMemberModal user={user} setUser={setUser} />);
              }}
            />
          </Grid>
          {user ? (
            <Grid column gap="small">
              <Grid row gap="small" middle>
                <Icon name="user" style={{ width: 20 }} />
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </Grid>
              <Grid row gap="small" middle>
                <Icon name="gender" style={{ width: 20 }} />
                <span>{`${user.gender === 0 ? 'Homme' : 'Femme'}`}</span>
              </Grid>
              <Grid row gap="small" middle>
                <Icon name="mail" style={{ width: 20 }} />
                <span>{user.email}</span>
              </Grid>
              <Grid row gap="small" middle>
                <Icon name="phone" style={{ width: 20 }} />
                {user.phone ? (
                  <span>{user.phone}</span>
                ) : (
                  <span className="uk-text-italic">
                    Numéro de téléphone non renseigné
                  </span>
                )}
              </Grid>
              {isRoleIncluded(CANDIDATE_USER_ROLES, [user.role]) && (
                <Grid row gap="small" middle>
                  <Icon name="home" style={{ width: 20 }} />
                  {user.address ? (
                    <span>{user.address}</span>
                  ) : (
                    <span className="uk-text-italic">
                      Adresse postale non renseignée
                    </span>
                  )}
                </Grid>
              )}
            </Grid>
          ) : undefined}
        </div>
      </Grid>
      <Grid childWidths={['1-1']} gap="medium">
        <UserInformationCard
          isAdmin
          user={user}
          onChange={(data: User) => {
            setUser(data);
          }}
        />
        <div className="uk-flex uk-flex-center">
          <Button
            style="danger"
            size="large"
            onClick={() => {
              openModal(
                <ModalEdit
                  formId="delete-user"
                  title="Supprimer un membre"
                  description="Attention, si vous supprimer ce membre, toutes les données qui lui sont associées seront définitivement perdues. Êtes-vous sûr de vouloir continuer ?"
                  submitText="Supprimer le membre"
                  formSchema={schemaDeleteUser}
                  onSubmit={deleteUser}
                />
              );
            }}
          >
            <span className="uk-margin-small-right">
              Supprimer l&apos;utilisateur
            </span>
            <Icon name="trash" />
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
