import React from 'react';

import { Tooltip } from 'react-tooltip';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
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
      modal={{
        title: 'Le candidat a retrouvé un emploi ?',
        confirmationText: 'Valider',
      }}
      isToggled={!!member?.candidat?.employed}
      subtitle={
        member?.candidat && (
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
      onToggle={async (employed, fields, onClose) => {
        let mutatedFields = fields;
        if (fields) {
          const contract = findConstantFromValue(fields.contract, CONTRACTS);
          const hasEnd = contract && contract.end;
          mutatedFields = {
            ...fields,
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            endOfContract:
              fields.endOfContract && hasEnd ? fields.endOfContract : null,
          };
        }

        try {
          await Api.putCandidate(member.id, {
            employed,
            ...mutatedFields,
          });
          setMember({
            ...member,
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            candidat: {
              ...member.candidat,
              ...{
                employed,
                ...mutatedFields,
              },
            },
          });
          UIkit.notification(
            'Le profil du candidat a été mis à jour !',
            'success'
          );
          if (onClose) onClose();
        } catch (error) {
          console.error(error);
          UIkit.notification('Une erreur est survenue', 'danger');
        }
      }}
    />
  );
}
