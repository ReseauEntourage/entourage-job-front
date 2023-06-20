import PropTypes from 'prop-types';
import React from 'react';
import { Api } from 'src/api';
import { Button, Grid } from 'src/components/utils';
import { CV_STATUS } from 'src/constants';
import { COACH_USER_ROLES } from 'src/constants/users';
import {
  isRoleIncluded,
  getUserCandidateFromCoachOrCandidate,
} from 'src/utils';

const NoCV = ({ candidateId, user, setCV }) => {
  const candidate = getUserCandidateFromCoachOrCandidate(user);
  return (
    <Grid column middle>
      {isRoleIncluded(COACH_USER_ROLES, user.role) &&
      (!candidate || (candidate && candidate.deletedAt)) ? (
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-text-center">
            <span className="uk-text-primary">Aucun candidat</span>
            &nbsp;n&apos;est rattaché à ce compte coach.
          </h2>
          <p className="uk-text-center">
            Il peut y avoir plusieurs raisons à ce sujet. Contactez
            l&apos;équipe LinkedOut pour en savoir plus.
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
              style="primary"
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

NoCV.propTypes = {
  candidateId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    candidat: PropTypes.shape({}),
  }).isRequired,
  setCV: PropTypes.func.isRequired,
};

export default NoCV;
