import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { NotifBadges } from 'src/components/headers/HeaderConnected/HeaderConnected.types';
import { ADMIN_ROLES, USER_ROLES } from 'src/constants/users';
import { usePrevious } from './utils';

const reducePromisesResults = (data) => {
  return data.reduce((acc, curr) => {
    if (curr && curr.data) {
      return {
        ...acc,
        ...curr.data,
      };
    }
    return acc;
  }, {});
};

export function useNotifBadges(
  user: UserWithUserCandidate,
  path: string,
  candidateId: string
) {
  const [badges, setBadges] = useState<NotifBadges>({
    offers: 0,
    note: 0,
    cv: 0,
    members: 0,
    messaging: 1,
  });

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user !== prevUser) {
      if (user.role === USER_ROLES.ADMIN) {
        const queriesToExecute: (() => Promise<AxiosResponse>)[] = [];
        if (user.adminRole === ADMIN_ROLES.CANDIDATES) {
          queriesToExecute.push(() => {
            return Api.getUsersMembersCount();
          });
        } else if (user.adminRole === ADMIN_ROLES.COMPANIES) {
          queriesToExecute.push(() => {
            return Api.getOpportunitiesAdminCount();
          });
        } else {
          queriesToExecute.push(() => {
            return Api.getUsersMembersCount();
          });
          queriesToExecute.push(() => {
            return Api.getOpportunitiesAdminCount();
          });
        }
        Promise.all(
          queriesToExecute.map((query) => {
            return query;
          })
        )
          .then((data) => {
            const { pendingCVs, pendingOpportunities } =
              reducePromisesResults(data);

            setBadges((prevBadges) => {
              return {
                ...prevBadges,
                members: pendingCVs || 0,
                offers: pendingOpportunities || 0,
                messages: 42 || 0,
              };
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (candidateId) {
        Promise.all([
          Api.getOpportunitiesUserCount(candidateId),
          Api.getCandidateCheckUpdate(candidateId),
          Api.getCheckUpdate(candidateId),
        ])
          .then((data) => {
            const {
              unseenOpportunities,
              noteHasBeenModified,
              cvHasBeenModified,
            } = reducePromisesResults(data);

            setBadges((prevBadges) => {
              return {
                ...prevBadges,
                offers: unseenOpportunities || 0,
                note: noteHasBeenModified ? 1 : 0,
                cv: cvHasBeenModified ? 1 : 0,
                messages: 1,
              };
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [user, path, prevUser, candidateId]);

  return badges;
}
