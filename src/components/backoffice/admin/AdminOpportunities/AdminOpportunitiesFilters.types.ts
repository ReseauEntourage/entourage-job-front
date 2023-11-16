import { BusinessLineValue, Contract, AdminOffersTags } from 'src/constants';
import { AdminZone } from 'src/constants/departements';

export interface AdminOpportunitiesFilters {
  tag: {
    label: string;
    value: AdminOffersTags;
  };
  businessLines: {
    label: string;
    value: BusinessLineValue;
    prefix: string[];
  }[];
  contracts: {
    label: string;
    value: Contract;
    end: boolean;
  }[];
  department: {
    value: string;
    label: string;
    zone: AdminZone;
  }[];
}
