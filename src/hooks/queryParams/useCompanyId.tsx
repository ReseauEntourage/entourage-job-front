import { useRouter } from 'next/router';

export const useCompanyId = () => {
  const {
    query: { companyId },
  } = useRouter();

  return companyId as string;
};
