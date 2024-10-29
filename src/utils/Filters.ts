import _ from 'lodash';
import { MEMBER_FILTERS_DATA } from 'src/constants';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { Filter } from 'src/constants/utils';
import { isRoleIncluded } from './Finding';

const filterMemberTypeConstantsByRole = (roles: UserRole[]): Filter => {
  return {
    ...MEMBER_FILTERS_DATA[0],
    constants: MEMBER_FILTERS_DATA[0].constants.filter(({ value }) => {
      return isRoleIncluded(roles, value as UserRole);
    }),
  };
};

export const mutateTypeFilterDependingOnRole = (
  role: UserRole | UserRole[]
) => {
  if (role === USER_ROLES.COACH) {
    return [
      filterMemberTypeConstantsByRole([USER_ROLES.COACH]),
      MEMBER_FILTERS_DATA[1],
      MEMBER_FILTERS_DATA[3],
    ];
  }
  if (role === USER_ROLES.CANDIDATE) {
    return [
      filterMemberTypeConstantsByRole([USER_ROLES.CANDIDATE]),
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
