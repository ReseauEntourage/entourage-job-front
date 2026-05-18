import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Api } from 'src/api';

const LinkedInCallback = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { code, state, error } = router.query;

    if (error || !code) {
      router.replace('/backoffice/parametres?linkedin=error');
      return;
    }

    Api.exchangeLinkedInCode(code as string, state as string)
      .then(({ data }) => {
        const url = data.pendingShare
          ? `/backoffice/parametres?linkedin=connected&pendingShare=${data.pendingShare}`
          : '/backoffice/parametres?linkedin=connected';
        router.replace(url);
      })
      .catch(() => {
        router.replace('/backoffice/parametres?linkedin=error');
      });
  }, [router, router.isReady]);

  return null;
};

export default LinkedInCallback;
