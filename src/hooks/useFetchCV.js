import { useEffect, useState } from 'react';
import Api from 'src/api/index.ts';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import _ from 'lodash';

export function useFetchCV(user) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState(undefined);

  useEffect(() => {
    if (user) {
      const candidateId = getCandidateIdFromCoachOrCandidate(user);

      if (candidateId) {
        Api.getCVByCandidateId(candidateId)
          .then(({ data }) => {
            if (data && !_.isEmpty(data)) {
              setCV(data);
            } else {
              setCV(null);
            }
          })
          .catch((err) => {
            console.error(err);
            setError('Une erreur est survenue durant le chargement du CV.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setCV(null);
        setLoading(false);
      }
    }
  }, [user]);

  return { cv, setCV, error, loading };
}
