import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { UserWithUserCandidate } from 'src/api/types';
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
import { authenticationActions, updateUserSelectors } from 'src/use-cases/authentication';
import { isRoleIncluded } from 'src/utils';
import { ReduxRequestEvents } from 'src/constants';

export const useUpdateUser = (user: UserWithUserCandidate) => {

  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = React.useState<boolean>(false);

  const updateUserStatus = useSelector(
    updateUserSelectors.selectFetchUserStatus
  )

  useEffect(() => {
    if (updateUserStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
      UIkit.notification(
        'Vos informations personnelles ont bien été mises à jour',
        'success'
      );
    } else if (updateUserStatus === ReduxRequestEvents.FAILED) {
      UIkit.notification(
        "Une erreur c'est produite lors de la mise à jour",
        'danger'
      );
    }
  }, [updateUserStatus])


  useEffect(() => {
    return () => {
      dispatch(authenticationActions.updateUserReset());
    };
  }, [dispatch]);

  const updateUser = useCallback(
    (newUserData: Partial<UserWithUserCandidate>) => {
      console.log(newUserData);
      if (!_.isEmpty(newUserData) && user.id) {
        console.log('dispatching');
        dispatch(authenticationActions.updateUserRequested({userId: user.id, user: newUserData}));
      }
    },
    [dispatch, user]
  );

  return { updateUser, closeModal };
};

export const useParametres = (user: UserWithUserCandidate) => {
  const modalTitle = 'Édition - Informations personnelles';

  const { updateUser, closeModal } = useUpdateUser(user);

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
        if (user.email !== oldEmail.toLowerCase()) {
          setError("L'ancienne adresse email n'est pas valide");
        } else if (newEmail0.length === 0 || newEmail0 !== newEmail1) {
          setError('Les deux adresses email ne sont pas indentiques');
        } else {
          newUserData.email = newEmail0.toLowerCase();
          await updateUser(newUserData);
          setError('');
        }
      } else {
        await updateUser(newUserData);
      }
    },
    [updateUser, user]
  );

  const openPersonalDataModalAsAdmin = useCallback(() => {
    openModal(
      <ModalEdit
        submitText="Envoyer"
        title={modalTitle}
        closeOnNextRender={closeModal}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          phone: user.phone,
          zone: user.zone,
          adminRole: user.adminRole,
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
          if (firstName !== user.firstName) {
            newUserData.firstName = firstName;
          }
          if (lastName !== user.lastName) {
            newUserData.lastName = lastName;
          }
          if (zone !== user.zone) {
            newUserData.zone = zone;
          }
          if (adminRole !== user.adminRole) {
            newUserData.adminRole = adminRole;
          }
          if (gender !== user.gender) {
            newUserData.gender = gender;
          }
          if (phone !== user.phone) {
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
  }, [checkEmailAndSubmit, user]);

  const openPersonalDataModalAsCoach = useCallback(() => {
    openModal(
      <ModalEdit
        title={modalTitle}
        defaultValues={{
          phone: user.phone,
        }}
        formSchema={formPersonalDataAsCoach}
        closeOnNextRender={closeModal}
        onSubmit={async (
          { phone, oldEmail, newEmail0, newEmail1 },
          closeModal,
          setError
        ) => {
          const newUserData: Partial<UserWithUserCandidate> = {};
          if (phone !== user.phone) {
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
  }, [checkEmailAndSubmit, user]);

  const openPersonalDataModalAsCandidate = useCallback(() => {
    openModal(
      <ModalEdit
        title={modalTitle}
        defaultValues={{
          phone: user.phone,
          address: user.address,
        }}
        closeOnNextRender={closeModal}
        formSchema={formPersonalDataAsCandidate}
        onSubmit={async (
          { phone, address, oldEmail, newEmail0, newEmail1 },
          closeModal,
          setError
        ) => {
          // déclenche une fonction updateUser
          // cette fonction fait juste un dispatch
          // j'ai un useEffect qui écoute l'événement "succedeed"
          // comment fermer la modale ?
          const newUserData: Partial<UserWithUserCandidate> = {};
          if (phone !== user.phone) {
            newUserData.phone = phone;
          }
          if (address !== user.address) {
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
  }, [checkEmailAndSubmit, user]);

  const openCorrespondingModal = useCallback(() => {
    if (isRoleIncluded(ALL_USER_ROLES, user.role)) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        openPersonalDataModalAsCandidate();
        return;
      }
      if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
        openPersonalDataModalAsCoach();
        return;
      }
    }

    openPersonalDataModalAsAdmin();
  }, [
    openPersonalDataModalAsAdmin,
    openPersonalDataModalAsCandidate,
    openPersonalDataModalAsCoach,
    user,
  ]);

  return {
    openCorrespondingModal,
  };
};
