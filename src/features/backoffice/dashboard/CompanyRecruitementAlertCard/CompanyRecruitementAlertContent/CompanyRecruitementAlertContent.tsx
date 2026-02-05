import React from 'react';
import { Button, ImgUserProfile, LucidIcon } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { CompanyRecruitementAlertEditModal } from '../CompanyRecruitementAlertModal/CompanyRecruitementAlertEditModal';
import { RecruitementAlert } from 'src/api/types';
import {
  StyledAlertHeader,
  StyledBadgesContainer,
  StyledCandidatesInfo,
  StyledCandidatesAvatars,
  StyledCandidatesCount,
  StyledViewCandidatesLink,
  StyledBadge,
  ButtonContainer,
  StyledCompanyRecruitementAlertContainer,
  StyledAvatar,
  StyledMoreAvatar,
  StyledSpinnerContainer,
  StyledClickableLink,
} from './CompanyRecruitementAlertContent.styles';
import { useCompanyRecruitementAlertContent } from './useCompanyRecruitementAlertContent';

interface CompanyRecruitementAlertContentProps {
  alert: RecruitementAlert;
}

export const CompanyRecruitementAlertContent = ({
  alert,
}: CompanyRecruitementAlertContentProps) => {
  const {
    title,
    badgesStringList,
    isLoadingMatching,
    candidates,
    handleDelete,
    handleEdit,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateAlert,
    alertData,
  } = useCompanyRecruitementAlertContent(alert);

  const matchingCandidatesText =
    candidates.length === 0
      ? 'Aucun candidat ne correspond à votre recherche.'
      : `${candidates.length} candidat${
          candidates.length > 1 ? 's' : ''
        } correspond${candidates.length > 1 ? 'ent' : ''} à votre recherche.`;

  return (
    <StyledCompanyRecruitementAlertContainer>
      <StyledAlertHeader>
        <h3>{title}</h3>
        <ButtonContainer>
          <Button variant="secondary" rounded="circle" onClick={handleEdit}>
            <LucidIcon name="Pencil" />
          </Button>
          <Button variant="secondary" rounded="circle" onClick={handleDelete}>
            <LucidIcon name="Trash2" fill="transparent" />
          </Button>
        </ButtonContainer>
      </StyledAlertHeader>

      <StyledBadgesContainer>
        {badgesStringList.map((badge, index) => (
          <StyledBadge key={index + badge}>{badge}</StyledBadge>
        ))}
      </StyledBadgesContainer>

      <StyledCandidatesInfo>
        {isLoadingMatching ? (
          <StyledSpinnerContainer>
            <Spinner />
          </StyledSpinnerContainer>
        ) : (
          <>
            {candidates.length > 0 && (
              <StyledClickableLink
                href={`/backoffice/alerte-candidats/${alert.id}`}
              >
                <StyledCandidatesAvatars>
                  {candidates.slice(0, 4).map((candidate, index) => (
                    <StyledAvatar key={index}>
                      <ImgUserProfile
                        user={candidate}
                        size={30}
                        hasPicture={candidate?.hasPicture || false}
                      />
                    </StyledAvatar>
                  ))}
                  {candidates.length > 4 && (
                    <StyledMoreAvatar key="more">
                      +{candidates.length - 4}
                    </StyledMoreAvatar>
                  )}
                </StyledCandidatesAvatars>
              </StyledClickableLink>
            )}
            {candidates.length > 0 ? (
              <StyledClickableLink
                href={`/backoffice/alerte-candidats/${alert.id}`}
              >
                <StyledCandidatesCount>
                  {matchingCandidatesText}
                </StyledCandidatesCount>
              </StyledClickableLink>
            ) : (
              <StyledCandidatesCount>
                {matchingCandidatesText}
              </StyledCandidatesCount>
            )}
          </>
        )}
        {candidates.length > 0 && (
          <StyledViewCandidatesLink
            href={`/backoffice/alerte-candidats/${alert.id}`}
          >
            Voir les candidats
          </StyledViewCandidatesLink>
        )}
      </StyledCandidatesInfo>

      <CompanyRecruitementAlertEditModal
        alert={alertData}
        onSubmit={handleUpdateAlert}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
    </StyledCompanyRecruitementAlertContainer>
  );
};
