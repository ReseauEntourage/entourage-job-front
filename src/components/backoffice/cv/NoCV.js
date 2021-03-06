import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'src/components/utils';
import { CV_STATUS, USER_ROLES } from 'src/constants';
import Api from 'src/Axios';

const NoCV = ({ candidatId, user, setCV }) => {
  return (
    <Grid column middle>
      {user.role === USER_ROLES.COACH &&
      (!user.candidat || (user.candidat && user.candidat.deletedAt)) ? (
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
        (user.role === USER_ROLES.ADMIN ||
          user.role === USER_ROLES.CANDIDAT ||
          user.role === USER_ROLES.COACH) && (
          <div className="uk-flex uk-flex-column uk-flex-middle">
            <h2 className="uk-text-bold uk-text-center">
              <span className="uk-text-primary">Aucun CV</span>
              &nbsp;n&apos;est rattaché à ce compte.
            </h2>
            <div className="uk-flex uk-flex-center">
              <Button
                style="primary"
                onClick={() => {
                  return Api.post(`/cv`, {
                    cv: { UserId: candidatId, status: CV_STATUS.New.value },
                  }).then(({ data }) => {
                    return setCV(data);
                  });
                }}
              >
                Créer le CV
              </Button>
            </div>
          </div>
        )
      )}
    </Grid>
  );
};

NoCV.propTypes = {
  candidatId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    candidat: PropTypes.shape(),
  }).isRequired,
  setCV: PropTypes.func.isRequired,
};

export default NoCV;
