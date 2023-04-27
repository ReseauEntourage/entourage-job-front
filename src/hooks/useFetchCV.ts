import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { CV } from '../api/types';
import { Api } from 'src/api/index';

export function useFetchCV(candidateId) {
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cv, setCV] = useState<CV>(undefined);

  const fetchCV = useCallback(async () => {
    if (candidateId) {
      try {
        const { data } = await Api.getCVByCandidateId(candidateId);
        if (data && !_.isEmpty(data)) {
          setCV(data);
        } else {
          setCV(null);
        }
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue durant le chargement du CV.');
      }
      setLoading(false);
    } else {
      setCV(null);
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  return { cv, setCV, error, loading };
}
