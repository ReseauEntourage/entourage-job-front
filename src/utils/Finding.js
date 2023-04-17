import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  OFFER_STATUS,
} from 'src/constants';
import _ from 'lodash';

export function findOfferStatus(status, isPublic, isRecommended) {
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
}

export function findConstantFromValue(valToFind, constantsToFindFrom) {
  return (
    constantsToFindFrom.find(({ value }) => {
      return value === valToFind;
    }) || {
      label: valToFind,
      value: valToFind,
    }
  );
}

export function getValueFromFormField(fieldValue) {
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
}

export function isRoleIncluded(superset, subset) {
  if (!Array.isArray(subset)) {
    return _.difference([subset], superset).length === 0;
  }
  return _.difference(subset, superset).length === 0;
}

export function getUserCandidateFromCoachOrCandidate(member) {
  if (member) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, member.role)) {
      return member.candidat;
    }

    if (isRoleIncluded(COACH_USER_ROLES, member.role)) {
      return member.coaches;
    }
  }
  return null;
}

export function getRelatedUser(member) {
  if (member) {
    if (member.candidat && member.candidat.coach) {
      return member.candidat.coach;
    }
    if (member.coaches && member.coaches.length > 0) {
      return member.coaches.map(({ candidat }) => {
        return candidat;
      });
    }
  }

  return null;
}

export function getCoachFromCandidate(candidate) {
  if (candidate && isRoleIncluded(CANDIDATE_USER_ROLES, candidate.role)) {
    if (candidate.candidat && candidate.candidat.coach) {
      return candidate.candidat.coach;
    }
  }

  return null;
}

export function getCandidateFromCoach(coach, candidateId) {
  if (coach && isRoleIncluded(COACH_USER_ROLES, coach.role)) {
    if (coach.coaches && coach.coaches.length > 0) {
      return coach.coaches.find(({ candidat }) => {
        return candidat.id === candidateId;
      })?.candidat;
    }
  }

  return null;
}

export function getCandidateIdFromCoachOrCandidate(member) {
  if (member) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, member.role)) {
      return member.id;
    }

    if (
      isRoleIncluded(COACH_USER_ROLES, member.role) &&
      member.coaches &&
      member.coaches.length > 0
    ) {
      return member.coaches.map(({ candidat }) => {
        return candidat.id;
      });
    }
  }
  return null;
}
