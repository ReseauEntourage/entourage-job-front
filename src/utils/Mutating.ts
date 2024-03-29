import { Opportunity, OpportunityUser } from 'src/api/types';
import { OFFER_STATUS } from 'src/constants';
import { findOfferStatus } from 'src/utils/Finding';
import { AnyCantFix } from './Types';

const getAlternateDefaultOfferStatus = (
  offer: Opportunity = {} as Opportunity,
  opportunityUser: OpportunityUser = {} as OpportunityUser
) => {
  return findOfferStatus(
    OFFER_STATUS[0].value,
    offer.isPublic,
    opportunityUser.recommended
  ).label;
};

export const mutateDefaultOfferStatus = (offer, opportunityUser) => {
  return [
    {
      ...OFFER_STATUS[0],
      label: getAlternateDefaultOfferStatus(offer, opportunityUser),
    },
    ...OFFER_STATUS.slice(1),
  ];
};

export function mutateToArray<T>(
  value: T | null | undefined
): T extends AnyCantFix[] | null | undefined ? T : T[] {
  if (value === null || value === undefined) {
    return value as T extends AnyCantFix[] | null | undefined ? T : never;
  }
  if (Array.isArray(value)) {
    return value as T extends AnyCantFix[] | null | undefined ? T : never;
  }
  return [value] as T extends AnyCantFix[] | null | undefined ? never : T[];
}
