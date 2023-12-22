import _ from 'lodash';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { User, UserWithUserCandidate } from 'src/api/types';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from 'src/components/forms/schemas/formPersonalData';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import {
  ALL_USER_ROLES,
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
} from 'src/constants/users';
import { authenticationActions } from 'src/use-cases/authentication';
import { isRoleIncluded } from 'src/utils';

export const useParametres = (
  userData: UserWithUserCandidate,
  user: User | UserWithUserCandidate,
  setUserData: (
    updatedUserData:
      | UserWithUserCandidate
      | ((
          prevUserData: UserWithUserCandidate | undefined
        ) => UserWithUserCandidate | undefined)
  ) => void
) => {
  const modalTitle = 'Édition - Informations personnelles';

  const dispatch = useDispatch();

  const setUser = useCallback(
    (nextUser: User) => {
      dispatch(authenticationActions.setUser(nextUser));
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (newUserData: Partial<UserWithUserCandidate>, closeModal) => {
      if (!_.isEmpty(newUserData)) {
        return Api.putUser(userData.id, newUserData)
          .then(() => {
            closeModal();
            setUserData((prevUserData) => {
              if (prevUserData && newUserData) {
                return {
                  ...(prevUserData || {}),
                  ...(newUserData || {}),
                };
              }
            });
            setUser({
              ...user,
              ...newUserData,
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
    [setUser, user, userData, setUserData]
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

  return {
    openCorrespondingModal,
  };
};
