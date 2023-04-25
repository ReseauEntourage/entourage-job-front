import React from 'react';

import { UserWithUserCandidate } from 'src/api/types';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';

interface MemberEmployedToggleProps {
  member: UserWithUserCandidate;

  setMember: (user: UserWithUserCandidate) => void;
}
export function MemberEmployedToggle({
  member,
  setMember,
}: MemberEmployedToggleProps) {
  return (
    <CandidateEmployedToggle
      modalTitle="Le candidat a retrouvé un emploi ?"
      modalConfirmation="Valider"
      defaultValue={member.candidat.employed}
      notificationMessage="Le profil du candidat a été mis à jour !"
      subtitle={
        member &&
        member.candidat && (
          <ContractLabel
            textWrap
            contract={member.candidat.contract}
            endOfContract={member.candidat.endOfContract}
          />
        )
      }
      setData={(newData) => {
        setMember({
          ...member,
          candidat: {
            ...member.candidat,
            ...newData,
          },
        });
      }}
      candidateId={member.id}
    />
  );
}
