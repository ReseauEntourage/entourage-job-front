import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CardList } from '@/src/components/ui/CardList';
import { NetworkDirectoryUserItem } from '../network-directory/NetworkDirectoryItem';
import {
  selectRecruitementAlertMatchingById,
  selectFetchRecruitementAlertMatchingLoading,
} from 'src/use-cases/recruitement-alerts';
import { StyledAlertCandidatesListContainer } from './AlertCandidates.styles';

interface AlertCandidatesListProps {
  alertId: string;
}

export function AlertCandidatesList({
  alertId,
}: AlertCandidatesListProps): React.ReactElement {
  const candidates = useSelector(selectRecruitementAlertMatchingById(alertId));
  const isLoading = useSelector(selectFetchRecruitementAlertMatchingLoading);

  const candidatesList = useMemo(() => {
    return candidates?.profiles?.map((candidate) => {
      return (
        <NetworkDirectoryUserItem
          key={candidate.id}
          id={candidate.id}
          firstName={candidate.firstName}
          lastName={candidate.lastName}
          role={candidate.role}
          department={candidate.department}
          sectorOccupations={candidate.sectorOccupations}
          job={candidate.currentJob || undefined}
          isAvailable={candidate.isAvailable || false}
          hasPicture={candidate.hasPicture || false}
          currentJob={candidate.currentJob || undefined}
        />
      );
    });
  }, [candidates]);

  return (
    <StyledAlertCandidatesListContainer>
      <CardList list={candidatesList} isLoading={isLoading} />
    </StyledAlertCandidatesListContainer>
  );
}
