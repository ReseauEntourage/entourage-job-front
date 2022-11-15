import _ from 'lodash';

const getOpportunityUserFromOffer = (offer, candidateId) => {
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

const filtersToQueryParams = (filters) => {
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

const getFiltersObjectsFromQueryParamsFront = (params, filtersConst) => {
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

const getFiltersTagsFromQueryParamsFront = (tag, filters) => {
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

export {
  getOpportunityUserFromOffer,
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
  getFiltersTagsFromQueryParamsFront,
};
