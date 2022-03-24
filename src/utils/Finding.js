import { OFFER_STATUS, USER_ROLES } from 'src/constants';
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

const getRelatedUser = (member) => {
  if (member.candidat && member.candidat.coach) {
    return member.candidat.coach;
  }
  if (member.coach && member.coach.candidat) {
    return member.coach.candidat;
  }
  return null;
};

const getCandidateFromCoachOrCandidate = (member) => {
  if (member.role === USER_ROLES.CANDIDAT) {
    return member.candidat;
  }

  return member.coach;
};

const getCandidateIdFromCoachOrCandidate = (member) => {
  if (member.role === USER_ROLES.CANDIDAT) {
    return member.id;
  }

  if (member.coach && member.coach.candidat) {
    return member.coach.candidat;
  }
  return null;
};

export {
  findOfferStatus,
  findConstantFromValue,
  getValueFromFormField,
  getRelatedUser,
  getCandidateIdFromCoachOrCandidate,
  getCandidateFromCoachOrCandidate,
};
