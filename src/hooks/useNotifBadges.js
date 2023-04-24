import { useEffect, useState } from 'react';
import { ADMIN_ROLES, USER_ROLES } from 'src/constants/users.ts';
import Api from 'src/api/index.ts';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
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

export function useNotifBadges(user, path) {
  const [badges, setBadges] = useState({
    offers: 0,
    note: 0,
    cv: 0,
    members: 0,
  });

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      if (user.role === USER_ROLES.ADMIN) {
        const queriesToExecute = [];
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
              };
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        const candidateId = getCandidateIdFromCoachOrCandidate(user);
        if (candidateId) {
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
                };
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  }, [user, path, prevUser]);

  return badges;
}
