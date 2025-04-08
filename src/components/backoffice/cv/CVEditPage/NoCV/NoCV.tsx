import React, { useEffect, useState } from 'react';
import { Api } from 'src/api';
import { CV, User, UserCandidateWithUsers } from 'src/api/types';
import { Button, Grid } from 'src/components/utils';
import { CV_STATUS } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { getUserCandidateFromCoachOrCandidate } from 'src/utils';

interface NoCVProps {
  candidateId: string;
  user: User;
  setCV: (data: CV) => void;
}

export const NoCV = ({ candidateId, user, setCV }: NoCVProps) => {
  const [candidate, setCandidate] = useState<
    UserCandidateWithUsers | undefined
  >();
  useEffect(() => {
    const associatedUsers = getUserCandidateFromCoachOrCandidate(user);
    if (Array.isArray(associatedUsers)) {
      setCandidate(
        associatedUsers.find((c) => c?.candidat?.id === candidateId)
      );
    } else if (associatedUsers) {
      setCandidate(associatedUsers);
    }
  }, [candidateId, user]);

  return (
    <Grid column middle>
      {user.role === USER_ROLES.COACH &&
      (!candidate || (candidate && candidate.deletedAt)) ? (
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-text-center">
            <span className="uk-text-primary">Aucun candidat</span>
            &nbsp;n&apos;est rattaché à ce compte coach.
          </h2>
          <p className="uk-text-center">
            Il peut y avoir plusieurs raisons à ce sujet. Contactez
            l&apos;équipe Entourage Pro pour en savoir plus.
          </p>
        </div>
      ) : (
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-text-center">
            <span className="uk-text-primary">Aucun CV</span>
            &nbsp;n&apos;est rattaché à ce compte.
          </h2>
          <div className="uk-flex uk-flex-center">
            <Button
              variant="primary"
              onClick={() => {
                return Api.postCV(
                  candidateId,
                  {
                    cv: { status: CV_STATUS.New.value },
                  },
                  false
                ).then(({ data }) => {
                  return setCV(data);
                });
              }}
            >
              Créer le CV
            </Button>
          </div>
        </div>
      )}
    </Grid>
  );
};
