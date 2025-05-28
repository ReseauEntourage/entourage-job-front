import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ParamProfessionalInformations } from '@/src/components/profile/ProfilePartCards/ParamProfessionalInformations/ParamProfessionalInformations';
import { ProfileCustomNudges } from '@/src/components/profile/ProfilePartCards/ProfileCustomNudges/ProfileCustomNudges';
import { ProfileDescription } from '@/src/components/profile/ProfilePartCards/ProfileDescription/ProfileDescription';
import { ProfileNudges } from '@/src/components/profile/ProfilePartCards/ProfileNudges/ProfileNudges';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import {
  currentUserActions,
  selectIsComplete,
} from '@/src/use-cases/current-user';
import { ProfileDeleteAccount } from '../../profile/ProfilePartCards/ProfileDeleteAccount/ProfileDeleteAccount';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { LoadingScreen } from '../LoadingScreen';
import { useConfirmationToaster } from '../parametres-old/useConfirmationToaster';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { ProfileChangePassword } from 'src/components/profile/ProfilePartCards/ProfileChangePassword/ProfileChangePassword';
import { ProfileContactPreferences } from 'src/components/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from 'src/components/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileDocuments } from 'src/components/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from 'src/components/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from 'src/components/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileInterests } from 'src/components/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from 'src/components/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileNotificationsPreferences } from 'src/components/profile/ProfilePartCards/ProfileNotificationsPreferences/ProfileNotificationsPreferences';
import { ProfileReviews } from 'src/components/profile/ProfilePartCards/ProfileReviews/ProfileReviews';
import { ProfileSkills } from 'src/components/profile/ProfilePartCards/ProfileSkills/ProfileSkills';
import { ProfileStats } from 'src/components/profile/ProfilePartCards/ProfileStats/ProfileStats';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';

import {
  StyledParametersLeftColumn,
  StyledParametersRightColumn,
  StyledParametersSectionContent,
} from './Parameters.styles';

export const Parameters = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();
  const userIsComplete = useSelector(selectIsComplete);

  useConfirmationToaster();

  // Fetch the complete user if not already done
  useEffect(() => {
    if (!userIsComplete) {
      dispatch(currentUserActions.fetchCompleteUserRequested());
    }
  }, [userIsComplete, dispatch]);

  if (!user || !userIsComplete) return <LoadingScreen />;

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        introduction={user.userProfile.introduction ?? ''}
        role={user.role}
        department={user.userProfile.department}
        isAvailable={user.userProfile.isAvailable}
        phone={user.phone}
        email={user.email}
        driverLicenses={['B']}
        isEditable
      />
      <Section className="custom-page">
        <StyledParametersSectionContent>
          {/* <InviteToUploadCv /> */}
          <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
            <StyledParametersLeftColumn
              className={`${isDesktop ? '' : 'mobile'}`}
            >
              <ParamProfessionalInformations
                sectorOccupations={user.userProfile.sectorOccupations ?? []}
                isEditable
              />
              <ProfileDescription
                isEditable
                description={user.userProfile.description}
              />
              <ProfileSkills
                skills={user.userProfile.skills || []}
                isEditable
              />
              <ProfileCustomNudges
                isEditable
                customNudges={user.userProfile.customNudges || []}
                firstName={user.firstName}
                role={user.role}
                userId={user.id}
                ownProfile
              />
              <ProfileExperiences
                userId={user.id}
                userFirstName={user.firstName}
                experiences={user.userProfile.experiences || []}
                isEditable
              />
              <ProfileFormations
                userId={user.id}
                userFirstName={user.firstName}
                formations={user.userProfile.formations || []}
                isEditable
              />
              <ProfileReviews
                userId={user.id}
                userFirstName={user.firstName}
                reviews={user.userProfile.reviews || []}
                isEditable
              />
            </StyledParametersLeftColumn>
            <StyledParametersRightColumn
              className={`${isDesktop ? '' : 'mobile'}`}
            >
              <ProfileDocuments
                userId={user.id}
                linkedinUrl={user.userProfile.linkedinUrl}
                hasExternalCv={user.userProfile.hasExternalCv}
                entourageProCv="/url/" // TODO: Add CvUrl
                isEditable
                smallCard
              />
              <ProfileLanguages
                userProfileLanguages={user.userProfile.userProfileLanguages}
                isEditable
                smallCard
              />
              <ProfileInterests
                interests={user.userProfile.interests}
                isEditable
                smallCard
              />
              {user.role === UserRoles.CANDIDATE && (
                <ProfileContracts
                  contracts={user.userProfile.contracts}
                  isEditable
                  smallCard
                />
              )}
              <ProfileContactPreferences isEditable smallCard />
              <ProfileNudges
                userRole={user.role}
                nudges={user.userProfile.nudges || []}
                isEditable
                smallCard
              />
              <ProfileNotificationsPreferences isEditable smallCard />
              <ProfileStats
                smallCard
                averageDelayResponse={user.averageDelayResponse || null}
                responseRate={user.responseRate || null}
                lastConnection={user.lastConnection}
              />
              <ProfileChangePassword smallCard />
              <ProfileDeleteAccount smallCard />
            </StyledParametersRightColumn>
          </StyledBackofficeGrid>
        </StyledParametersSectionContent>
      </Section>
    </StyledBackofficeBackground>
  );
};
