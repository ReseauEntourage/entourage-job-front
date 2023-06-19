import React, { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Api } from 'src/api/index.ts';
import { STORAGE_KEYS } from 'src/constants/index.ts';
import { USER_ROLES } from 'src/constants/users.ts';
import { getDefaultUrl } from 'src/utils/Redirects.ts';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isReady, replace, push, pathname, asPath } = useRouter();

  const [user, setUser] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const resetAndRedirect = useCallback(
    async (requestedPath) => {
      setIsFirstLoad(false);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      setUser(null);
      if (!requestedPath || requestedPath.includes('/backoffice')) {
        await push(
          requestedPath
            ? {
                pathname: '/login',
                query: {
                  requestedPath,
                },
              }
            : '/login'
        );
      }
    },
    [push]
  );

  const restrictAccessByRole = useCallback(
    async (role) => {
      // restriction conditions
      if (
        (pathname.includes('/list') && role !== USER_ROLES.COACH_EXTERNAL) ||
        (pathname.includes('/backoffice/admin') &&
          !pathname.includes('/backoffice/admin/offres') &&
          role !== USER_ROLES.ADMIN) ||
        (pathname.includes('/backoffice/candidat') &&
          !pathname.includes('/offres') &&
          role === USER_ROLES.ADMIN)
      ) {
        const path = getDefaultUrl(role);
        await replace(path);
      }
    },
    [pathname, replace]
  );

  const logout = useCallback(async () => {
    await resetAndRedirect();
  }, [resetAndRedirect]);

  const login = useCallback(async (email, password) => {
    const { data } = await Api.postAuthLogin({
      email: email.toLowerCase(),
      password,
    });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
    setUser(data.user);
  }, []);

  useEffect(() => {
    if (isReady && isFirstLoad) {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        Api.getAuthCurrent()
          .then(({ data: currentUser }) => {
            setUser(currentUser);
            setIsFirstLoad(false);
            restrictAccessByRole(currentUser.role);
          })
          .catch(async (err) => {
            console.error(err);
            resetAndRedirect(asPath);
          });
      } else {
        resetAndRedirect(asPath);
      }
    }
  }, [asPath, isFirstLoad, isReady, resetAndRedirect, restrictAccessByRole]);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default UserProvider;
