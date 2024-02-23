import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { UserCandidateWithUsers } from 'src/api/types';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import { ToggleWithModal } from 'src/components/utils/Inputs/ToggleWithModal';
import { Contract } from 'src/constants';
import { CANDIDATE_USER_ROLES, UserRole } from 'src/constants/users';
import { currentUserActions } from 'src/use-cases/current-user';
import { isRoleIncluded } from 'src/utils';
import { CVModalConfirmation } from './CVModalConfirmation';
import { CVModalEdit } from './CVModalEdit';
import { StyledCVPreferenceLine } from './CVPreferences.styles';

export const CVPreferences = ({
  userRole,
  candidat,
  candidatId,
}: {
  userRole: UserRole;
  candidat: UserCandidateWithUsers;
  candidatId: string;
}) => {
  const dispatch = useDispatch();

  const dispatchUpdateCandidate = useCallback(
    (keyValue: {
      employed?: boolean;
      hidden?: boolean;
      contract?: Contract | null;
      endOfContract?: string | null;
    }) => {
      dispatch(
        currentUserActions.updateCandidateRequested({
          userId: candidatId,
          userCandidate: keyValue,
        })
      );
    },
    [candidatId, dispatch]
  );

  if (!candidat || !candidatId) return null;
  return (
    <>
      <StyledCVPreferenceLine>
        <CandidateEmployedToggle
          title={
            isRoleIncluded(CANDIDATE_USER_ROLES, userRole)
              ? "J'ai retrouvé un emploi"
              : 'Le candidat a retrouvé un emploi'
          }
          isToggled={candidat?.employed}
          modal={
            <CVModalEdit
              title={
                isRoleIncluded(CANDIDATE_USER_ROLES, userRole)
                  ? 'Vous avez retrouvé un emploi ?'
                  : 'Le candidat a-t-il retrouvé un emploi ?'
              }
              dispatchOnSubmit={dispatchUpdateCandidate}
            />
          }
          onToggle={(employed) => {
            dispatchUpdateCandidate({
              employed,
              contract: null,
              endOfContract: null,
            });
          }}
          subtitle={
            candidat.contract && (
              <ContractLabel
                contract={candidat.contract}
                endOfContract={candidat.endOfContract}
              />
            )
          }
        />
      </StyledCVPreferenceLine>
      <StyledCVPreferenceLine>
        <ToggleWithModal
          id="hidden"
          title="Masquer mon CV"
          modal={
            <CVModalConfirmation
              id="hidden"
              dispatchOnSubmit={dispatchUpdateCandidate}
            />
          }
          isToggled={candidat.hidden}
          onToggle={(hidden) => {
            dispatchUpdateCandidate({ hidden });
          }}
        />
      </StyledCVPreferenceLine>
    </>
  );
};
