import React from 'react';
import { Spinner } from '@/src/components/utils/Spinner';
import { CompanyRecruitementAlertEditModal } from '../CompanyRecruitementAlertModal/CompanyRecruitementAlertEditModal';
import { RecruitementAlert } from 'src/api/types';
import { Button, ImgProfile, LucidIcon } from 'src/components/utils';
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
      ? 'Aucune candidat ne correspond à votre recherche.'
      : `${candidates.length} candidat${
          candidates.length > 1 ? 's' : ''
        } correspond${candidates.length > 1 ? 'ent' : ''} à votre recherche.`;

  return (
    <StyledCompanyRecruitementAlertContainer>
      <StyledAlertHeader>
        <h3>{title}</h3>
        <ButtonContainer>
          <Button
            variant="secondary"
            size="small"
            rounded="circle"
            onClick={handleEdit}
          >
            <LucidIcon name="Pencil" size={20} />
          </Button>
          <Button
            variant="secondary"
            size="small"
            rounded="circle"
            onClick={handleDelete}
          >
            <LucidIcon name="Trash2" size={20} fill="transparent" />
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
              <StyledCandidatesAvatars>
                {candidates.slice(0, 4).map((candidate, index) => (
                  <StyledAvatar key={index}>
                    <ImgProfile
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
            )}
            <StyledCandidatesCount>
              {matchingCandidatesText}
            </StyledCandidatesCount>
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
