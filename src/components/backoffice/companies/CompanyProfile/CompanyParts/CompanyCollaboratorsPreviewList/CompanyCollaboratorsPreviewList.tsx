/* eslint import/no-unresolved: "off" */
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SvgIcon } from '@/assets/icons/icons';
import { Api } from '@/src/api';
import { CompanyWithUsers } from '@/src/api/types';
import { CompanyInviteCollaboratorsModal } from '@/src/components/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '@/src/components/modals/Modal';
import { ProfilePartCard } from '@/src/components/profile/ProfilePartCards/Card/Card/Card';
import { ProfileCard } from '@/src/components/utils/Cards/EntityCards/ProfileCard';
import { useIsMobile } from '@/src/hooks/utils';
import { notificationsActions } from '@/src/use-cases/notifications';
import { LucidIcon, Text } from 'src/components/utils';
import {
  StyledNavigationContainer,
  StyledNextButton,
  StyledPaginationDot,
  StyledPrevButton,
  StyledSwiperContainer,
  StyledSwiperItemContainer,
} from './CompanyCollaboratorsPreviewList.styles';

export interface CompanyCollaboratorsPreviewListProps {
  companyId: string;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const CompanyCollaboratorsPreviewList = ({
  companyId,
  isEditable = false,
  smallCard = false,
}: CompanyCollaboratorsPreviewListProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const [companyWithCollaborators, setCompanyWithCollaborators] =
    React.useState<CompanyWithUsers | null>(null);
  const [fetchCollaboratorsLoading, setFetchCollaboratorsLoading] =
    React.useState(true);
  const isCompleted =
    !fetchCollaboratorsLoading &&
    !!companyWithCollaborators &&
    companyWithCollaborators.users.length > 0;

  const ctaTitle = useMemo(() => {
    if (!isEditable) return null;
    if (!isCompleted) return 'Inviter des collaborateurs';
    return 'Voir tous les collaborateurs';
  }, [isCompleted, isEditable]);

  const ctaCallback = useCallback(() => {
    if (!isCompleted) {
      openModal(<CompanyInviteCollaboratorsModal companyId={companyId} />);
    } else {
      router.push(`/backoffice/companies/${companyId}/collaborators`);
    }
  }, [companyId, isCompleted, router]);

  useEffect(() => {
    setFetchCollaboratorsLoading(true);
    Api.getCompanyByIdWithUsersAndPendingInvitations(companyId)
      .then((response) => {
        const { data } = response;
        setCompanyWithCollaborators(data);
        setFetchCollaboratorsLoading(false);
      })
      .catch((error) => {
        setFetchCollaboratorsLoading(false);
        console.error('Error fetching company collaborators:', error);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message:
              "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise",
          })
        );
      });
  }, [companyId, dispatch]);

  const slidesPerView = useMemo(() => {
    // Always display 1 slide on mobile
    if (isMobile) return 1.4;
    // On desktop, display 2 slides and 60% of the next one
    return 2.6;
  }, [isMobile]);

  const enabledNavigation = useMemo(() => {
    return !!(
      companyWithCollaborators?.users &&
      slidesPerView < companyWithCollaborators.users.length
    );
  }, [companyWithCollaborators?.users, slidesPerView]);

  const fallback = useMemo(() => {
    return {
      content: isEditable ? (
        <Text>
          Vous n’avez pas encore de collaborateurs rattachés à votre entreprise.
          Invitez les à devenir coach.
        </Text>
      ) : (
        <Text>
          Cette entreprise n’a pas encore de collaborateurs rattachés.
        </Text>
      ),
      icon: <SvgIcon name="IlluReseau" />,
    };
  }, [isEditable]);

  return (
    <ProfilePartCard
      title="Collaborateurs d'entreprise"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaCallback={ctaCallback}
      ctaTitle={ctaTitle}
      fallback={fallback}
      smallCard={smallCard}
    >
      <StyledSwiperContainer>
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={30}
          pagination={{
            el: '.dot-pagination',
            type: 'bullets',
            clickable: true,
          }}
          modules={[Pagination, Navigation]}
          navigation={{
            prevEl: '.button-prev',
            nextEl: '.button-next',
            enabled: enabledNavigation,
          }}
          observer
          observeParents
        >
          {companyWithCollaborators?.users.map((user) => (
            <SwiperSlide key={user.id}>
              <StyledSwiperItemContainer>
                <ProfileCard
                  key={user.id}
                  userId={user.id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  role={user.role}
                  hasPicture={user.userProfile.hasPicture}
                  isAvailable={user.userProfile.isAvailable}
                  currentJob={user.userProfile.currentJob || undefined}
                  sectorOccupations={user.userProfile.sectorOccupations}
                  nudges={user.userProfile.nudges || []}
                />
              </StyledSwiperItemContainer>
            </SwiperSlide>
          ))}
          <StyledNavigationContainer>
            <StyledPaginationDot className="dot-pagination" />
            {enabledNavigation && (
              <StyledPrevButton className="button-prev">
                <LucidIcon name="ChevronLeft" />
              </StyledPrevButton>
            )}
            {enabledNavigation && (
              <StyledNextButton className="button-next">
                <LucidIcon name="ChevronRight" />
              </StyledNextButton>
            )}
          </StyledNavigationContainer>
        </Swiper>
      </StyledSwiperContainer>
    </ProfilePartCard>
  );
};
