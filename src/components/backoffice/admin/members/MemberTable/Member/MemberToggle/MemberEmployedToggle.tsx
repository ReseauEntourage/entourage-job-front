import React from 'react';

import { Tooltip } from 'react-tooltip';
import { UserWithUserCandidate } from 'src/api/types';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
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
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    member.candidat.contract,

    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    member.candidat.endOfContract
  );

  return (
    <CandidateEmployedToggle
      modalTitle="Le candidat a retrouvé un emploi ?"
      modalConfirmation="Valider"
      defaultValue={
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        member.candidat.employed
      }
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

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
