import React, { useEffect, useState } from 'react';
import { Api } from '@/src/api';

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

  return (
    <div
      id="app-version"
      className="uk-flex uk-flex-column uk-flex-middle uk-text-small uk-text-muted uk-margin-small-top"
    >
      <span>
        Version Front : v{process.env.NEXT_PUBLIC_APP_VERSION} ({frontRelease})
      </span>
      {backVersion.status === 'success' && (
        <span>
          Version Back : v{backVersion.version} ({backVersion.release || 'dev'})
        </span>
      )}
      {backVersion.status === 'error' && (
        <span>Version Back : indisponible</span>
      )}
    </div>
  );
};
