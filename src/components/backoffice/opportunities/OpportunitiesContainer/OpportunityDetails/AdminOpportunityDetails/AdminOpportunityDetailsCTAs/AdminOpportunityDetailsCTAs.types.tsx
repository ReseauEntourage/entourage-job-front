import type { JSX } from 'react';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { AdminOffersTags } from 'src/constants';

export type AdminOffersCTA =
  | 'validate'
  | 'reject'
  | 'recommand'
  | 'duplicate'
  | 'edit'
  | 'archive'
  | 'editExternal';

export type CTAsByTagType = {
  tag: AdminOffersTags;
  ctas: AdminOffersCTA[];
}[];

export type AdminOffersAction =
  | 'validateOpportunity'
  | 'archiveOpportunity'
  | 'editOpportunity'
  | 'editExternalOpportunity'
  | 'duplicateOpportunity'
  | 'recommendOpportunity';

export type AllCTAsType = {
  [K in AdminOffersCTA]: {
    color: string;
    className: '' | UIKIT_BUTTON_STYLES_SPEC;
    action: AdminOffersAction;
    text: JSX.Element;
  };
};
