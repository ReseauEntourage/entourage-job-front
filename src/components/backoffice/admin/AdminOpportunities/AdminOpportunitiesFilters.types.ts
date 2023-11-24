import { BusinessLineValue, Contract } from 'src/constants';
import { AdminZone } from 'src/constants/departements';

export interface AdminOpportunitiesFilters {
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
