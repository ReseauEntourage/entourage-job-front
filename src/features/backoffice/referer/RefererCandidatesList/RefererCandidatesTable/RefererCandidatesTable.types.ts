export interface RefererCandidatesTableItem {
  id: string;
  name: string;
  email: string;
  coachesContactedCount: string;
  eventsParticipatedCount: string;
  referredAt: string;
  onboardingCompletedAt: string;
}

export interface RefererCandidatesTableProps {
  items: RefererCandidatesTableItem[];
}
