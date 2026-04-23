import { useRouter } from 'next/router';

export function useEntity(): string | string[] | undefined {
  const {
    query: { entity },
  } = useRouter();

  return entity;
}
