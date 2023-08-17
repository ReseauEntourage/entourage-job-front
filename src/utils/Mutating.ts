import { Opportunity, OpportunityUser } from 'src/api/types';
import { OFFER_STATUS } from 'src/constants';
import { findOfferStatus } from 'src/utils/Finding';

const updateField = (fieldToUpdate, props, i) => {
  const field = { ...fieldToUpdate };
  if (props[i].option) {
    const optionIndexToUpdate = field.options.findIndex((option) => {
      return option.value === props[i].option;
    });
    field.options[optionIndexToUpdate][props[i].propName] = props[i].value;
  } else {
    field[props[i].propName] = props[i].value;
  }
  return field;
};


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
