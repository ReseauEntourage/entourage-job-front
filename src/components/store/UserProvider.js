import React, { createContext, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Api from 'src/Axios';
import { STORAGE_KEYS, USER_ROLES } from 'src/constants';

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
      if (
        (pathname.includes('/backoffice/admin') &&
          !pathname.includes('/backoffice/admin/offres') &&
          role !== USER_ROLES.ADMIN) ||
        (pathname.includes('/backoffice/candidat') &&
          !pathname.includes('/backoffice/candidat/offres') &&
          role === USER_ROLES.ADMIN)
      ) {
        await replace('/login');
      }
    },
    [pathname, replace]
  );

  const logout = useCallback(async () => {
    await resetAndRedirect();
  }, [resetAndRedirect]);

  const login = useCallback(async (email, password) => {
    const { data } = await Api.post('/auth/login', {
      email: email.toLowerCase(),
      password,
    });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.user.token);
    setUser(data.user);
  }, []);

  useEffect(() => {
    if (isReady && isFirstLoad) {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        Api.get('/auth/current')
          .then(({ data }) => {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.user.token);
            setUser(data.user);
            setIsFirstLoad(false);
            restrictAccessByRole(data.user.role);
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
