import { useContext, useEffect, useState } from 'react';
import { Api } from 'src/api';
import { USER_ROLES } from 'src/constants/users';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';

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
