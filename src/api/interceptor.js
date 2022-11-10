import { STORAGE_KEYS } from 'src/constants';

export const addAxiosInterceptors = (api) => {
  api.interceptors.request.use(
    (config) => {
      const configModified = config;
      /**
       * Contrôle window uniquement pour éviter les erreurs côté serveur Next.js
       * A vérifier si une optimisation est possible.
       * Source : https://spectrum.chat/next-js/general/localstorage-is-not-defined~6a6798f7-63b0-4184-9861-e66f5dce3934
       */
      if (
        typeof window !== 'undefined' &&
        localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      ) {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (accessToken) {
          configModified.headers.authorization = `Token ${accessToken}`;
        }
      }
      return configModified;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
