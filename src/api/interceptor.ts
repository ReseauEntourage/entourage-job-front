import { AxiosInstance } from 'axios';
import { STORAGE_KEYS } from 'src/constants';

const isServer = typeof window === 'undefined';

export const addAxiosInterceptors = (api: AxiosInstance): void => {
  api.interceptors.request.use(
    (config) => {
      const configModified = config;

      if (!isServer && localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)) {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (accessToken) {
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          configModified.headers.authorization = `Bearer ${accessToken}`;
        }
      }
      return configModified;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
