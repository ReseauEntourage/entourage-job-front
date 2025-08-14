import React from 'react';
import { Spinner } from '@/src/components/utils/Spinner';
import { CompanyRecruitementAlertEditModal } from '../CompanyRecruitementAlertModal/CompanyRecruitementAlertEditModal';
import { RecruitementAlert } from 'src/api/types';
import { Button, LucidIcon } from 'src/components/utils';
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
    candidatesCount,
    handleDelete,
    handleEdit,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateAlert,
    alertData,
  } = useCompanyRecruitementAlertContent(alert);

  return (
    <StyledCompanyRecruitementAlertContainer>
      <StyledAlertHeader>
        <h3>{title}</h3>
        <ButtonContainer>
          <Button variant="secondary" size="small" onClick={handleEdit}>
            <LucidIcon name="Pencil" size={20} />
          </Button>
          <Button variant="secondary" size="small" onClick={handleDelete}>
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
            <StyledCandidatesAvatars>
              {[...Array(Math.min(candidatesCount, 3))].map((_, index) => (
                <StyledAvatar key={index}>{index + 1}</StyledAvatar>
              ))}
            </StyledCandidatesAvatars>
            <StyledCandidatesCount>
              {candidatesCount}{' '}
              {candidatesCount > 1
                ? 'personnes correspondent'
                : 'personne correspond'}{' '}
              à votre recherche.
            </StyledCandidatesCount>
          </>
        )}
        {candidatesCount > 0 && (
          <StyledViewCandidatesLink href="#">
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
