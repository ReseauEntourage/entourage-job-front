import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Api } from 'src/api';
import { CV } from 'src/api/types';

export function useFetchCV(candidateId) {
  const [error, setError] = useState<string>(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [cv, setCV] = useState<CV>(
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    undefined
  );

  const fetchCV = useCallback(async () => {
    if (candidateId) {
      try {
        const { data } = await Api.getPublicProfileByCandidateId(candidateId);
        if (data && !_.isEmpty(data)) {
          setCV(data);
        } else {
          setCV(
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            null
          );
        }
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue durant le chargement du CV.');
      }
      setLoading(false);
    } else {
      setCV(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        null
      );
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  return { cv, setCV, error, loading };
}
