export const useIsDev = (): boolean => {
  return process.env.NEXT_PUBLIC_ENV === 'development';
};
