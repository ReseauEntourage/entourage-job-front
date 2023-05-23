import _ from 'lodash';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users.ts';
import { MEMBER_FILTERS_DATA } from 'src/constants/index.ts';
import { isRoleIncluded } from './Finding.ts';

const filterMemberTypeConstantsByRole = (roles) => {
  return {
    ...MEMBER_FILTERS_DATA[0],
    constants: MEMBER_FILTERS_DATA[0].constants.filter((roleConstants) => {
      return isRoleIncluded(roles, roleConstants.value);
    }),
  };
};
export const mutateTypeFilterDependingOnRole = (role) => {
  if (isRoleIncluded(COACH_USER_ROLES, role)) {
    return [
      filterMemberTypeConstantsByRole(COACH_USER_ROLES),
      MEMBER_FILTERS_DATA[1],
      MEMBER_FILTERS_DATA[3],
    ];
  }
  if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
    return [
      filterMemberTypeConstantsByRole(CANDIDATE_USER_ROLES),
      ...MEMBER_FILTERS_DATA.slice(1),
    ];
  }

  return MEMBER_FILTERS_DATA;
};

export const getOpportunityUserFromOffer = (offer, candidateId) => {
  let opportunityUser;
  if (
    offer.opportunityUsers &&
    Array.isArray(offer.opportunityUsers) &&
    offer.opportunityUsers.length > 0
  ) {
    opportunityUser = offer.opportunityUsers.find((oppUser) => {
      return oppUser.UserId === candidateId;
    });
  } else {
    opportunityUser = offer.opportunityUsers;
  }
  return opportunityUser;
};

export const filtersToQueryParams = (filters) => {
  const params = {};
  _.forEach(Object.keys(filters), (filter) => {
    params[filter] =
      filters[filter].length > 0
        ? filters[filter].map((f) => {
            return f?.value;
          })
        : undefined;
  });
  return params;
};

export const getFiltersObjectsFromQueryParamsFront = (params, filtersConst) => {
  const filters = {};
  if (filtersConst) {
    _.forEach(filtersConst, (filterConst) => {
      if (params[filterConst.key]) {
        const value = params[filterConst.key];
        if (Array.isArray(value)) {
          filters[filterConst.key] = [
            ..._.map(value, (val) => {
              return filterConst.constants.find((constantValue) => {
                return constantValue.value.toString() === val;
              });
            }),
          ];
        } else {
          filters[filterConst.key] = [
            filterConst.constants.find((constantValue) => {
              return constantValue.value.toString() === value;
            }),
          ];
        }
      } else {
        filters[filterConst.key] = [];
      }
    });
  }
  return filters;
};

export const getFiltersTagsFromQueryParamsFront = (tag, filters) => {
  const updatedFilters = JSON.parse(JSON.stringify(filters));
  const filterToDeActivate = updatedFilters.find((filter) => {
    return filter.active;
  });
  const filterToActivate = updatedFilters.find((filter) => {
    return filter.tag === tag;
  });
  if (filterToDeActivate) filterToDeActivate.active = false;
  if (filterToActivate) filterToActivate.active = true;
  return updatedFilters;
};
