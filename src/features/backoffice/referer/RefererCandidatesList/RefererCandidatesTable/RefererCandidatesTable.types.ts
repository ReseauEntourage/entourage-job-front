export interface RefererCandidatesTableItem {
  id: string;
  name: string;
  email: string;
  coachesContactedCount: string;
  referredAt: string;
  onboardingCompletedAt: string;
}

export interface RefererCandidatesTableProps {
  items: RefererCandidatesTableItem[];
}
