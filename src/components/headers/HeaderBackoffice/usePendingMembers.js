import { UserContext } from 'src/store/UserProvider';
import { Api } from 'src/api/index.ts';
import { USER_ROLES } from 'src/constants/users.ts';
import { useContext, useEffect, useState } from 'react';
import { usePrevious } from 'src/hooks/utils';

export function usePendingMembers() {
  const { user } = useContext(UserContext);
  const prevUser = usePrevious(user);

  const [pendingMembersCount, setPendingMembersCount] = useState(0);

  useEffect(() => {
    async function fetchPendingMembersCount() {
      const {
        data: { pendingCVs },
      } = await Api.getUsersMembersCount();
      setPendingMembersCount(pendingCVs);
    }

    if (user && user !== prevUser && user.role === USER_ROLES.ADMIN) {
      fetchPendingMembersCount();
    }
  }, [prevUser, user]);

  return { pendingMembersCount };
}
