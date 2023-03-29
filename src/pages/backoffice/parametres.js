import UIkit from 'uikit';

import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { UserContext } from 'src/store/UserProvider';
import { Card, Grid, Section } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import Api from 'src/api/index.ts';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import schemaPersonalData from 'src/components/forms/schema/formPersonalData';
import schemaChangePassword from 'src/components/forms/schema/formChangePassword';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants';
import { useResetForm } from 'src/hooks/utils';
import UserInformationCard from 'src/components/cards/UserInformationCard';
import { areRolesIncluded, mutateFormSchema } from 'src/utils';
import _ from 'lodash';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';
import PasswordCriterias from 'src/components/PasswordCriterias';

const Parametres = () => {
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [form, resetForm] = useResetForm();

  let mutatedSchema = schemaPersonalData;

  if (userData) {
    mutatedSchema = mutateFormSchema(mutatedSchema, [
      {
        fieldId: 'gender',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
    ]);
    if (userData.role !== USER_ROLES.ADMIN) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'firstName',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'lastName',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'zone',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'adminRole',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }

    if (userData.role !== USER_ROLES.CANDIDATE) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'address',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'addressLabel',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
  }

  useEffect(() => {
    if (user) {
      setLoadingPersonal(true);
      Api.getUserById(user.id)
        .then(({ data }) => {
          setUserData(data);
        })
        .finally(() => {
          return setLoadingPersonal(false);
        });
    }
  }, [user]);

  const updateUser = (newUserData, closeModal) => {
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
          UIkit.notification(
            "Une erreur c'est produite lors de la mise à jour de vos informations personnelles",
            'danger'
          );
        });
    }
  };

  return (
    <LayoutBackOffice title="Mes Paramètres">
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, vous pouvez gérer les données qui sont liées à votre compte sur LinkedOut. Vous pouvez aussi changer votre mail et votre mot de passe."
        />
        {user && (
          <Grid childWidths={['1-2@m']}>
            <Grid childWidths={['1-1']}>
              {/* Preferences du CV */}
              {areRolesIncluded(CANDIDATE_USER_ROLES, [userData.role]) && (
                <Card title="Préférences du CV">
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
                      onClick={() => {
                        openModal(
                          <ModalEdit
                            submitText="Envoyer"
                            title="Édition - Informations personnelles"
                            defaultValues={{
                              firstName: userData.firstName,
                              lastName: userData.lastName,
                              gender: userData && userData.gender.toString(),
                              phone: userData.phone,
                              address: userData.address,
                              zone: userData.zone,
                              adminRole: userData.adminRole,
                            }}
                            formSchema={mutatedSchema}
                            onSubmit={async (
                              {
                                firstName,
                                lastName,
                                zone,
                                adminRole,
                                gender,
                                phone,
                                address,
                                oldEmail,
                                newEmail0,
                                newEmail1,
                              },
                              closeModal,
                              setError
                            ) => {
                              let newUserData = {};
                              if (userData.role === USER_ROLES.ADMIN) {
                                newUserData = {
                                  firstName,
                                  lastName,
                                  gender,
                                  zone,
                                  adminRole,
                                };
                                if (phone !== userData.phone) {
                                  newUserData.phone = phone;
                                }
                                if (address !== userData.address) {
                                  newUserData.address = address;
                                }
                                if (
                                  userData.email === oldEmail &&
                                  newEmail0 === newEmail1
                                ) {
                                  newUserData.email = newEmail0.toLowerCase();
                                }
                                await updateUser(newUserData, closeModal);
                              } else {
                                if (phone !== userData.phone) {
                                  newUserData.phone = phone;
                                }
                                if (address !== userData.address) {
                                  newUserData.address = address;
                                }
                                if (oldEmail || newEmail0 || newEmail1) {
                                  if (
                                    userData.email !== oldEmail.toLowerCase()
                                  ) {
                                    setError(
                                      "L'ancienne adresse email n'est pas valide"
                                    );
                                  } else if (
                                    newEmail0.length === 0 ||
                                    newEmail0 !== newEmail1
                                  ) {
                                    setError(
                                      'Les deux adresses email ne sont pas indentiques'
                                    );
                                  } else {
                                    newUserData.email = newEmail0.toLowerCase();
                                    await updateUser(newUserData, closeModal);
                                    setError('');
                                  }
                                } else {
                                  await updateUser(newUserData, closeModal);
                                }
                              }
                            }}
                          />
                        );
                      }}
                    />
                  )}
                </Grid>
                {userData ? (
                  <Grid column gap="small">
                    <Grid row gap="small">
                      <IconNoSSR name="user" style={{ width: 20 }} />
                      <span>{`${userData.firstName} ${userData.lastName}`}</span>
                    </Grid>
                    {userData.role !== USER_ROLES.ADMIN && (
                      <Grid row gap="small">
                        <IconNoSSR name="gender" style={{ width: 20 }} />
                        <span>
                          {`${userData.gender === 0 ? 'Homme' : 'Femme'}`}
                        </span>
                      </Grid>
                    )}
                    <Grid row gap="small">
                      <IconNoSSR name="mail" style={{ width: 20 }} />
                      <span>{userData.email}</span>
                    </Grid>
                    {userData.role !== USER_ROLES.ADMIN && (
                      <Grid row gap="small">
                        <IconNoSSR name="phone" style={{ width: 20 }} />
                        {userData.phone ? (
                          <span>{userData.phone}</span>
                        ) : (
                          <span className="uk-text-italic">
                            Numéro de téléphone non renseigné
                          </span>
                        )}
                      </Grid>
                    )}
                    {areRolesIncluded(CANDIDATE_USER_ROLES, [
                      userData.role,
                    ]) && (
                      <Grid row gap="small">
                        <IconNoSSR name="home" style={{ width: 20 }} />
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
              {userData.role !== USER_ROLES.ADMIN && (
                <UserInformationCard
                  user={userData}
                  onChange={(data) => {
                    setUserData(data);
                  }}
                />
              )}
            </Grid>

            {/* Changement de mot de passe */}
            <div className="uk-card uk-card-default uk-card-body">
              <Grid gap="small" between eachWidths={['expand', 'auto']}>
                <h3 className="uk-card-title">Changer de mot de passe</h3>
                {loadingPassword ? <div data-uk-spinner="ratio: .8" /> : <></>}
              </Grid>
              <PasswordCriterias />
              <FormWithValidation
                ref={form}
                submitText="Modifier"
                formSchema={schemaChangePassword}
                onSubmit={async (
                  { newPassword, oldPassword, confirmPassword },
                  setError
                ) => {
                  if (
                    newPassword !== oldPassword &&
                    newPassword === confirmPassword
                  ) {
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
                      setLoadingPassword(false);
                    } catch (err) {
                      console.error(err);
                      setError(
                        "Problème lors de l'enregistrement du nouveau mot de passe"
                      );
                      setLoadingPassword(false);
                    }
                  } else {
                    setError('Nouveau mot de passe erroné');
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
