import { OFFER_STATUS } from 'src/constants';
import _ from 'lodash';

const findOfferStatus = (status, isPublic, isRecommended) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) {
    if (isPublic) {
      if (isRecommended && currentStatus.recommended) {
        return {
          label: currentStatus.recommended,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
      if (currentStatus.public) {
        return {
          label: currentStatus.public,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
    }
    return {
      label: currentStatus.label,
      value: currentStatus.value,
      color: currentStatus.color,
    };
  }
  return { label: 'Non défini', color: 'muted' };
};

const findConstantFromValue = (valToFind, constantsToFindFrom) => {
  return (
    constantsToFindFrom.find(({ value }) => {
      return value === valToFind;
    }) || {
      label: valToFind,
      value: valToFind,
    }
  );
};

const getValueFromFormField = (fieldValue) => {
  if (
    _.isArray(fieldValue) &&
    _.every(fieldValue, (fieldVal) => {
      return _.isObject(fieldVal) && _.has(fieldVal, 'value');
    })
  ) {
    return fieldValue.map(({ value }) => {
      return value;
    });
  }
  if (_.isObject(fieldValue) && _.has(fieldValue, 'value')) {
    return fieldValue.value;
  }
  return fieldValue;
};

export { findOfferStatus, findConstantFromValue, getValueFromFormField };
