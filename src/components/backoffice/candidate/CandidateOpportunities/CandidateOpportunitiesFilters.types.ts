import { BusinessLineValue, Contract, OfferStatus } from 'src/constants';
import { AdminZone } from 'src/constants/departements';

export interface CandidateOpportunitiesFilters {
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
  status: {
    value: OfferStatus;
    label: string;
    color: string;
    public: string;
  }[];
}
