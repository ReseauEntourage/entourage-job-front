import React, { useEffect, useState } from 'react';
import { Api } from '@/src/api';
import { Text, Tooltip } from '@/src/components/ui';

type BackVersionState =
  | { status: 'loading' }
  | { status: 'success'; version: string; release: string | null }
  | { status: 'error' };

export const AppVersion = () => {
  const [backVersion, setBackVersion] = useState<BackVersionState>({
    status: 'loading',
  });

  useEffect(() => {
    let isMounted = true;

    Api.getVersion()
      .then(({ data }) => {
        if (isMounted) {
          setBackVersion({
            status: 'success',
            version: data.version,
            release: data.release,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackVersion({ status: 'error' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const frontRelease = process.env.NEXT_PUBLIC_HEROKU_RELEASE_VERSION || 'dev';

  const tooltipContent = (
    <>
      <Text size="xsmall" color="white">
        Version Front : v{process.env.NEXT_PUBLIC_APP_VERSION} ({frontRelease})
      </Text>
      {backVersion.status === 'success' && (
        <Text size="xsmall" color="white">
          Version Back : v{backVersion.version} ({backVersion.release || 'dev'})
        </Text>
      )}
      {backVersion.status === 'error' && (
        <Text size="xsmall" color="white">
          Version Back : indisponible
        </Text>
      )}
    </>
  );

  return (
    <div id="app-version">
      <Tooltip content={tooltipContent} ariaLabel="Version d'Entourage Pro">
        <Text size="xsmall" color="mediumGray" center>
          Version d&apos;Entourage Pro
        </Text>
      </Tooltip>
    </div>
  );
};
