import { useSelector } from 'react-redux';
import { selectReferral } from 'src/use-cases/current-user';

export function useCurrentUserReferral() {
  return useSelector(selectReferral);
}
