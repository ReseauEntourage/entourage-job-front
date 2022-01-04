/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/Axios';
import { Section } from 'src/components/utils';
import CVEditWelcome from 'src/components/cv/CVEditWelcome';
import { UserContext } from 'src/components/store/UserProvider';
import CVPageContent from 'src/components/backoffice/cv/CVPageContent';
import { USER_ROLES } from 'src/constants';

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

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        {userCompleteData && (
          <>
            <CVEditWelcome user={userCompleteData} />
            {userCompleteData.role === USER_ROLES.COACH &&
              (userCompleteData.coach ? (
                <CVPageContent
                  candidatId={
                    userCompleteData.role === USER_ROLES.COACH
                      ? userCompleteData.coach.candidat.id
                      : userCompleteData.id
                  }
                />
              ) : (
                <>
                  <h2 className="uk-text-bold uk-text-center">
                    <span className="uk-text-primary">
                      {user.role === USER_ROLES.COACH
                        ? 'Aucun candidat'
                        : 'Aucun bénévole coach'}
                    </span>{' '}
                    n&apos;est rattaché à ce compte.
                  </h2>
                  <p className="uk-text-center">
                    Il peut y avoir plusieurs raisons à ce sujet. Contacte
                    l&apos;équipe LinkedOut pour en savoir plus.
                  </p>
                </>
              ))}
            {userCompleteData.role === USER_ROLES.CANDIDAT && (
              <CVPageContent candidatId={userCompleteData.id} />
            )}
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default Edit;
