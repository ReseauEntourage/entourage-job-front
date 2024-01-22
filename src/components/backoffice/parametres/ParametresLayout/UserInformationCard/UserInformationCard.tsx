import _ from 'lodash';
import React from 'react';
import EmailIcon from 'assets/icons/email.svg';
import GenderIcon from 'assets/icons/gender.svg';
import HomeIcon from 'assets/icons/home.svg';
import LocationIcon from 'assets/icons/location.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { Card } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import {
  StyledInformationsPersonnellesList,
  StyledUserInformationCardTags,
} from './UserInformationCard.styles';
import { useOpenCorrespondingModal } from './useOpenModal';

interface UserInformationCardProps {
  loadingPersonal: boolean;
  title: React.ReactNode;
}

export const UserInformationCard = ({
  loadingPersonal,
  title,
}: UserInformationCardProps) => {
  const user = useAuthenticatedUser();
  const { openCorrespondingModal } = useOpenCorrespondingModal(user);

  return (
    <Card
      title={title}
      editCallback={openCorrespondingModal}
      isLoading={loadingPersonal}
      isMobileClosable
      isDefaultOpen
    >
      {!loadingPersonal && (
        <StyledInformationsPersonnellesList>
          <li>
            <UserIcon width={20} />
            {` ${user.firstName} ${user.lastName}`}
          </li>
          <li>
            <GenderIcon width={20} />
            {user.gender === 0 ? 'Homme' : 'Femme'}
          </li>
          <li>
            <EmailIcon width={20} />
            {user.email}
          </li>
          <li>
            <PhoneIcon width={20} />
            {user.phone ? (
              <>{user.phone}</>
            ) : (
              <>Numéro de téléphone non renseigné</>
            )}
          </li>
          {user.role !== USER_ROLES.ADMIN && (
            <>
              <li>
                <LocationIcon width={20} />
                {user.userProfile.department ? (
                  <>{user.userProfile.department}</>
                ) : (
                  <>Département non renseigné</>
                )}
              </li>
              {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
                <li>
                  <HomeIcon width={20} />
                  {user.address ? (
                    <>{user.address}</>
                  ) : (
                    <>Adresse postale non renseignée</>
                  )}
                </li>
              )}
            </>
          )}
          {user.role === USER_ROLES.ADMIN && (
            <StyledUserInformationCardTags>
              <Tag
                content={user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
              />
              {user.adminRole && <Tag content={_.capitalize(user.adminRole)} />}
            </StyledUserInformationCardTags>
          )}
        </StyledInformationsPersonnellesList>
      )}
    </Card>
  );
};
