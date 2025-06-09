import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const Redirection = () => {
  const { replace, pathname, query } = useRouter();

  useEffect(() => {
    if (pathname.endsWith('/cv')) {
      return;
    }
    replace(
      {
        pathname: `${pathname}/cv`,
        query,
      },
      undefined,
      {
        shallow: true,
      }
    );
  }, [pathname, query, replace]);

  return <LoadingScreen />;
};

export default Redirection;
