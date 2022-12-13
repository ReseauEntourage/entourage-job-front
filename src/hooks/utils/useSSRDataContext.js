import { createContext, useContext } from 'react';

export const SSRDataContext = createContext({});

export function useSSRDataContext() {
  return useContext(SSRDataContext);
}
