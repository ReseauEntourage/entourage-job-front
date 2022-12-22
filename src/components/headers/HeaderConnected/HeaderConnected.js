import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'src/components/store/UserProvider';
import { renderLinks } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.utils';
import { useNotifBadges } from 'src/hooks';
import { HeaderConnectedContent } from './HeaderConnectedContent';

const HeaderConnected = () => {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const [LINKS_CONNECTED, setLinks] = useState(renderLinks(user, logout));

  const badges = useNotifBadges(user, router.asPath);

  useEffect(() => {
    setLinks(renderLinks(user, logout));
  }, [user, logout]);

  if (!user) return null;

  return <HeaderConnectedContent badges={badges} links={LINKS_CONNECTED} />;
};

export default HeaderConnected;
