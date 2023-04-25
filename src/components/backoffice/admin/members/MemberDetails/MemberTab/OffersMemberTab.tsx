import React from 'react';
import AdminCandidateOpportunities from 'src/components/opportunities/AdminCandidateOpportunities';

interface OffersMemberTabProps {
  candidateId: string;
}
export function OffersMemberTab({ candidateId }: OffersMemberTabProps) {
  return <AdminCandidateOpportunities candidateId={candidateId} />;
}
