import React from 'react';

import { Tooltip } from 'react-tooltip';
import { UserWithUserCandidate } from 'src/api/types';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { buildContractLabel } from 'src/utils/Formatting';
import { StyledMemberToggleLabel } from './MemberToggle.styles';

const tooltipId = 'contract-tooltip';

interface MemberEmployedToggleProps {
  member: UserWithUserCandidate;

  setMember: (user: UserWithUserCandidate) => void;
}
export function MemberEmployedToggle({
  member,
  setMember,
}: MemberEmployedToggleProps) {
  const contractLabel = buildContractLabel(
    member.candidat.contract,
    member.candidat.endOfContract
  );

  return (
    <CandidateEmployedToggle
      modalTitle="Le candidat a retrouvé un emploi ?"
      modalConfirmation="Valider"
      defaultValue={member.candidat.employed}
      notificationMessage="Le profil du candidat a été mis à jour !"
      subtitle={
        member &&
        member.candidat && (
          <StyledMemberToggleLabel
            data-tooltip-id={tooltipId}
            data-tooltip-content={contractLabel}
            data-tooltip-place="bottom"
          >
            <ContractLabel
              textWrap
              contract={member.candidat.contract}
              endOfContract={member.candidat.endOfContract}
            />
            <Tooltip id={tooltipId} />
          </StyledMemberToggleLabel>
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
