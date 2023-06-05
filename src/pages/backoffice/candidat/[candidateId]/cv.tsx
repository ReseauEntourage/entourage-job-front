import React, { useContext, useEffect, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import CVPageContent from 'src/components/backoffice/cv/CVPageContent';
import ErrorMessage from 'src/components/backoffice/cv/ErrorMessage';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import CVEditWelcome from 'src/components/cv/CVEditWelcome';
import { Section } from 'src/components/utils';
import { COACH_USER_ROLES } from 'src/constants/users';
import { useFetchCV } from 'src/hooks/useFetchCV';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded, getRelatedUser } from 'src/utils/Finding';

const Edit = () => {
  const { user } = useContext(UserContext);

  const [userCompleteData, setUserCompleteData] =
    useState<UserWithUserCandidate>();

  const candidateId = useCandidateId();

  useEffect(() => {
    if (user) {
      Api.getUserById(user.id)
        .then(({ data }) => {
          return setUserCompleteData(data);
        })
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        });
    }
  }, [user]);

  const { cv, setCV, error, loading } = useFetchCV(candidateId);

  let content;

  if (loading || !user || !userCompleteData) {
    content = <LoadingScreen />;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (
    isRoleIncluded(COACH_USER_ROLES, user.role) &&
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
          LinkedOut pour en savoir plus.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <CVEditWelcome user={user} />
        <CVPageContent cv={cv} setCV={setCV} candidateId={candidateId} />
      </>
    );
  }

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>{content}</Section>
    </LayoutBackOffice>
  );
};

export default Edit;
