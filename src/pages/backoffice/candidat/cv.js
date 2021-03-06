import UIkit from 'uikit';
import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/Axios';
import { Section } from 'src/components/utils';
import CVEditWelcome from 'src/components/cv/CVEditWelcome';
import { UserContext } from 'src/components/store/UserProvider';
import CVPageContent from 'src/components/backoffice/cv/CVPageContent';
import { USER_ROLES } from 'src/constants';
import ErrorMessage from 'src/components/backoffice/cv/ErrorMessage';
import { useFetchCV } from 'src/hooks/useFetchCV';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { getCandidateIdFromCoachOrCandidate, getRelatedUser } from 'src/utils';

const Edit = () => {
  const { user } = useContext(UserContext);
  const [userCompleteData, setUserCompleteData] = useState();

  useEffect(() => {
    if (user) {
      Api.get(`/user/${user.id}`)
        .then(({ data }) => {
          return setUserCompleteData(data);
        })
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        });
    }
  }, [user]);

  const { cv, setCV, error, loading } = useFetchCV(userCompleteData);

  let content;
  if (loading || !user || !userCompleteData) {
    content = <LoadingScreen />;
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (
    userCompleteData.role === USER_ROLES.COACH &&
    !getRelatedUser(userCompleteData)
  ) {
    content = (
      <>
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte.
        </h2>
        <p className="uk-text-center">
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          LinkedOut pour en savoir plus.
        </p>
      </>
    );
  } else {
    content = (
      <>
        <CVEditWelcome user={userCompleteData} />
        <CVPageContent
          cv={cv}
          setCV={setCV}
          candidatId={getCandidateIdFromCoachOrCandidate(userCompleteData)}
        />
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
