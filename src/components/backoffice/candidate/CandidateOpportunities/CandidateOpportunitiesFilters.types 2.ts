export interface CandidateOpportunitiesFilters {
  businessLines: {
    label: string;
    value: string;
    prefix: string[];
  }[];
  contracts: {
    label: string;
    value: string;
    end: boolean;
  }[];
  department: {
    value: string;
    label: string;
    zone: string;
  }[];
  status: {
    value: number;
    label: string;
    color: string;
    public: string;
  }[];
}
