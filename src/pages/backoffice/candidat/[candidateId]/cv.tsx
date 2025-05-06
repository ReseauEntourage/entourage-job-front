import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CVEditPage } from 'src/components/backoffice/cv/CVEditPage';
import { CVEditWelcome } from 'src/components/backoffice/cv/CVEditPage/CVFicheEdition/CVEdit/CVEditWelcome';
import { ErrorMessage } from 'src/components/backoffice/cv/ErrorMessage';
import { Section } from 'src/components/utils';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { useFetchCV } from 'src/hooks/useFetchCV';
import { notificationsActions } from 'src/use-cases/notifications';
import { getRelatedUser } from 'src/utils/Finding';

const Edit = () => {
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [userCompleteData, setUserCompleteData] =
    useState<UserWithUserCandidate>();

  const candidateId = useCandidateId();

  useEffect(() => {
    Api.getUserById(user.id)
      .then(({ data }) => {
        setUserCompleteData(data);
      })
      .catch(() => {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Erreur lors du chargement du suivi',
          })
        );
      });
  }, [user.id, dispatch]);

  const { cv, setCV, error, loading } = useFetchCV(candidateId);

  let content;

  if (loading || !userCompleteData) {
    content = <LoadingScreen />;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (
    user.role === UserRoles.COACH &&
    !getRelatedUser(userCompleteData)
  ) {
    content = (
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte.
        </h2>
        <p className="uk-text-center">
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          Entourage Pro pour en savoir plus.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <CVEditWelcome user={user} />
        <CVEditPage cv={cv} setCV={setCV} candidateId={candidateId} />
      </>
    );
  }

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section className="custom-page">{content}</Section>
    </LayoutBackOffice>
  );
};

export default Edit;
