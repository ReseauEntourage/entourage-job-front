import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DirectoryItem } from 'src/components/backoffice/directory/DirectoryItem';
import { CardList } from 'src/components/utils/CardList';
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
    return candidates.map((candidate) => {
      return (
        <DirectoryItem
          key={candidate.id}
          id={candidate.id}
          firstName={candidate.firstName}
          lastName={candidate.lastName}
          role={candidate.role}
          department={candidate.department}
          nudges={candidate.nudges || []}
          sectorOccupations={candidate.sectorOccupations}
          job={candidate.currentJob || undefined}
          isAvailable={candidate.isAvailable || false}
          displayHelps
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
