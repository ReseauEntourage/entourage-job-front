import { useEffect, useState } from 'react';
import { Api } from 'src/api';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { usePrevious } from 'src/hooks/utils';

export function usePendingMembers() {
  const user = useAuthenticatedUser();
  const prevUser = usePrevious(user);

  const [pendingMembersCount, setPendingMembersCount] = useState(0);

  useEffect(() => {
    async function fetchPendingMembersCount() {
      const {
        data: { pendingCVs },
      } = await Api.getUsersMembersCount();
      setPendingMembersCount(pendingCVs);
    }

    if (user !== prevUser && user.role === UserRoles.ADMIN) {
      fetchPendingMembersCount();
    }
  }, [prevUser, user]);

  return { pendingMembersCount };
}
