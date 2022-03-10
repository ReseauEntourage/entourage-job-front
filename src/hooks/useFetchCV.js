import { useEffect, useState } from 'react';
import Api from 'src/Axios';
import { USER_ROLES } from 'src/constants';

export function useFetchCV(user) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState(undefined);

  useEffect(() => {
    if (user) {
      let candidatId;
      if (user.role === USER_ROLES.COACH && user.coach) {
        candidatId = user.coach.candidat.id;
      } else if (user.role === USER_ROLES.CANDIDAT) {
        candidatId = user.id;
      }

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
