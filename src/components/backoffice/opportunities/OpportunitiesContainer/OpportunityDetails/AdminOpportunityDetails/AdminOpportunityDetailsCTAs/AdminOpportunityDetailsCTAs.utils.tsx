import React from 'react';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { AdminOffersTags } from 'src/constants';
import {
  AllCTAsType,
  CTAsByTagType,
} from './AdminOpportunityDetailsCTAs.types';

export const allCTAs: AllCTAsType = {
  validate: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'validateOpportunity',
    text: <>Valider</>,
  },
  reject: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'archiveOpportunity',
    text: <>Rejeter</>,
  },
  recommand: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'recommendOpportunity',
    text: <>Recommander</>,
  },
  duplicate: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'duplicateOpportunity',
    text: <>Dupliquer</>,
  },
  edit: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'editOpportunity',
    text: <>Modifier</>,
  },
  editExternal: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'editExternalOpportunity',
    text: <>Modifier</>,
  },
  archive: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'archiveOpportunity',
    text: <>Archiver</>,
  },
};

export const getOpportunityCurrentTag = (
  opportunity: AdminOpportunityWithOpportunityUsers
): AdminOffersTags => {
  if (opportunity.isArchived) {
    return 'archived';
  }
  if (opportunity.isExternal) {
    return 'external';
  }
  if (opportunity.isValidated) {
    return 'validated';
  }
  return 'pending';
};

export const CTAsByTag: CTAsByTagType = [
  {
    tag: 'pending',
    ctas: ['validate', 'reject', 'recommand', 'duplicate', 'edit'],
  },
  {
    tag: 'validated',
    ctas: ['recommand', 'archive', 'duplicate', 'edit'],
  },
  {
    tag: 'external',
    ctas: ['editExternal', 'archive'],
  },
  {
    tag: 'archived',
    ctas: [
      // 'feedback'
    ],
  },
];

export const getCandidatesToShowInInput = (offer) => {
  if (offer.opportunityUsers && offer.opportunityUsers.length > 0) {
    if (offer.isPublic) {
      return offer.opportunityUsers
        .filter((oppUser) => {
          return oppUser.recommended;
        })
        .map((oppUser) => {
          return {
            value: oppUser.user?.id,
            label: `${oppUser.user?.firstName} ${oppUser.user?.lastName}`,
          };
        });
    }
    return offer.opportunityUsers.map((oppUser) => {
      return {
        value: oppUser.user?.id,
        label: `${oppUser.user?.firstName} ${oppUser.user?.lastName}`,
      };
    });
  }
  return undefined;
};
