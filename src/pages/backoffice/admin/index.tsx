import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const Redirection = () => {
  const { replace, pathname, query } = useRouter();

  useEffect(() => {
    replace(
      {
        pathname: `${pathname}/membres`,
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
