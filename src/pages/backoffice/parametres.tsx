import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { PasswordCriterias } from 'src/components/PasswordCriterias';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { UserInformationCard } from 'src/components/cards/UserInformationCard';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formChangePassword } from 'src/components/forms/schemas/formChangePassword';
import {
  formPersonalDataAsCandidate,
  formPersonalDataAsAdmin,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card, Grid, Section, ButtonIcon } from 'src/components/utils';
import { Icon } from 'src/components/utils/Icon';
import {
  ALL_USER_ROLES,
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { useResetForm } from 'src/hooks/utils/useResetForm';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded } from 'src/utils/Finding';

const Parametres = () => {
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState<UserWithUserCandidate>();
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [form, resetForm] = useResetForm();

  const modalTitle = 'Édition - Informations personnelles';

  useEffect(() => {
    if (user) {
      setLoadingPersonal(true);
      Api.getUserById(user.id)
        .then(({ data }) => {
          setUserData(data);
        })
        .finally(() => {
          setLoadingPersonal(false);
        });
    }
  }, [user]);

  const updateUser = useCallback(
    (newUserData: Partial<UserWithUserCandidate>, closeModal) => {
      if (!_.isEmpty(newUserData)) {
        return Api.putUser(userData.id, newUserData)
          .then(() => {
            closeModal();
            setUserData((prevUserData) => {
              return {
                ...prevUserData,
                ...newUserData,
              };
            });
            setUser((prevUser) => {
              return {
                ...prevUser,
                ...newUserData,
              };
            });
            UIkit.notification(
              'Vos informations personnelles ont bien été mises à jour',
              'success'
            );
          })
          .catch((err) => {
            console.error(err);
            if (err?.response?.status === 409) {
              UIkit.notification(
                'Cette adresse email est déjà utilisée',
                'danger'
              );
            } else {
              UIkit.notification(
                "Une erreur c'est produite lors de la mise à jour de vos informations personnelles",
                'danger'
              );
            }
          });
      }
    },
    [setUser, userData]
  );

  const checkEmailAndSubmit = useCallback(
    async (
      newUserData: Partial<UserWithUserCandidate>,
      oldEmail: string,
      newEmail0: string,
      newEmail1: string,
      setError: (msg: string) => void,
      closeModal: () => void
    ) => {
      if (oldEmail || newEmail0 || newEmail1) {
        if (userData.email !== oldEmail.toLowerCase()) {
          setError("L'ancienne adresse email n'est pas valide");
        } else if (newEmail0.length === 0 || newEmail0 !== newEmail1) {
          setError('Les deux adresses email ne sont pas indentiques');
        } else {
          newUserData.email = newEmail0.toLowerCase();
          await updateUser(newUserData, closeModal);
          setError('');
        }
      } else {
        await updateUser(newUserData, closeModal);
      }
    },
    [updateUser, userData]
  );

  const openPersonalDataModalAsAdmin = useCallback(() => {
    openModal(
      <ModalEdit
        submitText="Envoyer"
        title={modalTitle}
        defaultValues={{
          firstName: userData.firstName,
          lastName: userData.lastName,
          gender: userData.gender,
          phone: userData.phone,
          zone: userData.zone,
          adminRole: userData.adminRole,
        }}
        formSchema={formPersonalDataAsAdmin}
        onSubmit={async (
          {
            firstName,
            lastName,
            zone,
            adminRole,
            gender,
            phone,
            oldEmail,
            newEmail0,
            newEmail1,
          },
          closeModal,
          setError
        ) => {
          const newUserData: Partial<UserWithUserCandidate> = {};
          if (firstName !== userData.firstName) {
            newUserData.firstName = firstName;
          }
          if (lastName !== userData.lastName) {
            newUserData.lastName = lastName;
          }
          if (zone !== userData.zone) {
            newUserData.zone = zone;
          }
          if (adminRole !== userData.adminRole) {
            newUserData.adminRole = adminRole;
          }
          if (gender !== userData.gender) {
            newUserData.gender = gender;
          }
          if (phone !== userData.phone) {
            newUserData.phone = phone;
          }
          await checkEmailAndSubmit(
            newUserData,
            oldEmail,
            newEmail0,
            newEmail1,
            setError,
            closeModal
          );
        }}
      />
    );
  }, [checkEmailAndSubmit, userData]);

  const openPersonalDataModalAsCoach = useCallback(() => {
    openModal(
      <ModalEdit
        title={modalTitle}
        defaultValues={{
          phone: userData.phone,
        }}
        formSchema={formPersonalDataAsCoach}
        onSubmit={async (
          { phone, oldEmail, newEmail0, newEmail1 },
          closeModal,
          setError
        ) => {
          const newUserData: Partial<UserWithUserCandidate> = {};
          if (phone !== userData.phone) {
            newUserData.phone = phone;
          }
          await checkEmailAndSubmit(
            newUserData,
            oldEmail,
            newEmail0,
            newEmail1,
            setError,
            closeModal
          );
        }}
      />
    );
  }, [checkEmailAndSubmit, userData]);

  const openPersonalDataModalAsCandidate = useCallback(() => {
    openModal(
      <ModalEdit
        title={modalTitle}
        defaultValues={{
          phone: userData.phone,
          address: userData.address,
        }}
        formSchema={formPersonalDataAsCandidate}
        onSubmit={async (
          { phone, address, oldEmail, newEmail0, newEmail1 },
          closeModal,
          setError
        ) => {
          const newUserData: Partial<UserWithUserCandidate> = {};
          if (phone !== userData.phone) {
            newUserData.phone = phone;
          }
          if (address !== userData.address) {
            newUserData.address = address;
          }
          await checkEmailAndSubmit(
            newUserData,
            oldEmail,
            newEmail0,
            newEmail1,
            setError,
            closeModal
          );
        }}
      />
    );
  }, [checkEmailAndSubmit, userData]);

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(ALL_USER_ROLES, userData.role)) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, userData.role)) {
        openPersonalDataModalAsCandidate();
        return;
      }
      if (isRoleIncluded(COACH_USER_ROLES, userData.role)) {
        openPersonalDataModalAsCoach();
        return;
      }
    }

    openPersonalDataModalAsAdmin();
  }, [
    openPersonalDataModalAsAdmin,
    openPersonalDataModalAsCandidate,
    openPersonalDataModalAsCoach,
    userData,
  ]);

  return (
    <LayoutBackOffice title="Mes Paramètres">
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, vous pouvez gérer les données qui sont liées à votre compte sur LinkedOut. Vous pouvez aussi changer votre mail et votre mot de passe."
        />
        {user && userData && (
          <Grid childWidths={['1-2@m']}>
            <Grid childWidths={['1-1']}>
              {/* Preferences du CV */}
              {isRoleIncluded(CANDIDATE_USER_ROLES, userData.role) && (
                <Card title="Préférences du CV">
                  <div className="uk-margin-small-top">
                    <CandidateEmployedToggle
                      title="J'ai retrouvé un emploi"
                      modalTitle="Vous avez retrouvé un emploi ?"
                      modalConfirmation="Valider"
                      defaultValue={userData.candidat.employed}
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
                          candidat: {
                            ...userData.candidat,
                            ...newData,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="uk-margin-small-top">
                    <ToggleWithConfirmationModal
                      id="hidden"
                      title="Masquer mon CV"
                      modalTitle="Changer la visibilité du CV en ligne ?"
                      modalDescription={
                        <>
                          En masquant votre CV de LinkedOut, il ne sera plus
                          visible par les utilisateurs du site.
                          <br />
                          Vous pourrez le remettre en ligne à tout moment.
                        </>
                      }
                      modalConfirmation="Oui, masquer mon CV"
                      defaultValue={userData.candidat.hidden}
                      onToggle={(hidden) => {
                        return Api.putCandidate(userData.id, {
                          hidden,
                        })
                          .then(() => {
                            setUserData({
                              ...userData,
                              candidat: {
                                ...userData.candidat,
                                hidden,
                              },
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
                  </div>
                </Card>
              )}
              {/* Informations personnelles */}
              <div className="uk-card uk-card-default uk-card-body">
                <Grid gap="small" between eachWidths={['expand', 'auto']}>
                  <h3 className="uk-card-title">Informations personnelles</h3>
                  {loadingPersonal ? (
                    <div data-uk-spinner="ratio: .8" />
                  ) : (
                    <ButtonIcon
                      name="pencil"
                      onClick={openCorrespondingModal}
                    />
                  )}
                </Grid>
                {userData ? (
                  <Grid column gap="small">
                    <Grid row gap="small">
                      <Icon name="user" style={{ width: 20 }} />
                      <span>{`${userData.firstName} ${userData.lastName}`}</span>
                    </Grid>
                    {userData.role !== USER_ROLES.ADMIN && (
                      <Grid row gap="small">
                        <Icon name="gender" style={{ width: 20 }} />
                        <span>
                          {`${userData.gender === 0 ? 'Homme' : 'Femme'}`}
                        </span>
                      </Grid>
                    )}
                    <Grid row gap="small">
                      <Icon name="mail" style={{ width: 20 }} />
                      <span>{userData.email}</span>
                    </Grid>
                    {userData.role !== USER_ROLES.ADMIN && (
                      <Grid row gap="small">
                        <Icon name="phone" style={{ width: 20 }} />
                        {userData.phone ? (
                          <span>{userData.phone}</span>
                        ) : (
                          <span className="uk-text-italic">
                            Numéro de téléphone non renseigné
                          </span>
                        )}
                      </Grid>
                    )}
                    {isRoleIncluded(CANDIDATE_USER_ROLES, [userData.role]) && (
                      <Grid row gap="small">
                        <Icon name="home" style={{ width: 20 }} />
                        {userData.address ? (
                          <span>{userData.address}</span>
                        ) : (
                          <span className="uk-text-italic">
                            Adresse postale non renseignée
                          </span>
                        )}
                      </Grid>
                    )}
                    {userData.role === USER_ROLES.ADMIN && (
                      <Grid row gap="small">
                        <span className="uk-label">
                          {userData.zone
                            ? _.capitalize(userData.zone)
                            : 'Non renseignée'}
                        </span>
                        {userData.adminRole && (
                          <span className="uk-label">
                            {_.capitalize(userData.adminRole)}
                          </span>
                        )}
                      </Grid>
                    )}
                  </Grid>
                ) : undefined}
              </div>
              {isRoleIncluded(
                [
                  USER_ROLES.COACH,
                  USER_ROLES.CANDIDATE,
                  USER_ROLES.CANDIDATE_EXTERNAL,
                ],
                userData.role
              ) && <UserInformationCard user={userData} />}
            </Grid>

            {/* Changement de mot de passe */}
            <div className="uk-card uk-card-default uk-card-body">
              <Grid gap="small" between eachWidths={['expand', 'auto']}>
                <h3 className="uk-card-title">Changer de mot de passe</h3>
                {loadingPassword ? <div data-uk-spinner="ratio: .8" /> : <></>}
              </Grid>
              <PasswordCriterias />
              <FormWithValidation
                innerRef={form}
                submitText="Modifier"
                formSchema={formChangePassword}
                onSubmit={async (
                  { newPassword, oldPassword },
                  setError
                ) => {
                  setLoadingPassword(true);
                  try {
                    await Api.putUserChangePwd({
                      newPassword,
                      oldPassword,
                    });
                    UIkit.notification(
                      'Nouveau mot de passe enregistré',
                      'success'
                    );
                    resetForm();
                    setError('');
                    setLoadingPassword(false);
                  } catch (err) {
                    console.error(err);
                    setError("L'ancien mot de passe n'est pas valide");
                    setLoadingPassword(false);
                  }
                }}
              />
            </div>
          </Grid>
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
