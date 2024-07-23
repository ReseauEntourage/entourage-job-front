import { useSelector } from 'react-redux';
import { selectExternalCv } from 'src/use-cases/current-user';

export function useCurrentUserExternalCv() {
  return useSelector(selectExternalCv);
}
