import { useEffect, useState } from 'react';
import Api from 'src/Axios';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

export function useFetchCV(user) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState(undefined);

  useEffect(() => {
    if (user) {
      const candidatId = getCandidateIdFromCoachOrCandidate(user);

      if (candidatId) {
        Api.get(`/cv/`, {
          params: {
            userId: candidatId,
          },
        })
          .then(({ data }) => {
            if (data) {
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
