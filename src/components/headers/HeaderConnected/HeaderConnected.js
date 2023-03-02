import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'src/store/UserProvider';
import { renderLinks } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.utils';
import { useNotifBadges } from 'src/hooks';
import { usePrevious } from 'src/hooks/utils';
import { HeaderConnectedContent } from './HeaderConnectedContent';

const HeaderConnected = () => {
  const { user, logout } = useContext(UserContext);
  const { asPath } = useRouter();

  const [LINKS_CONNECTED, setLinks] = useState(renderLinks(user, logout));

  const badges = useNotifBadges(user, asPath);
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      setLinks(renderLinks(user, logout));
    }
  }, [user, logout, prevUser]);

  if (!user) return null;

  return <HeaderConnectedContent badges={badges} links={LINKS_CONNECTED} />;
};

export default HeaderConnected;
