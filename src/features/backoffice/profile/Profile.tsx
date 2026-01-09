import React from 'react';
import { Section } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { ProfileContactPreferences } from '@/src/features/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from '@/src/features/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileCustomNudges } from '@/src/features/profile/ProfilePartCards/ProfileCustomNudges/ProfileCustomNudges';
import { ProfileDocuments } from '@/src/features/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileInterests } from '@/src/features/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from '@/src/features/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileNudges } from '@/src/features/profile/ProfilePartCards/ProfileNudges/ProfileNudges';
import { ProfileProfessionalInformations } from '@/src/features/profile/ProfilePartCards/ProfileProfessionalInformations/ProfileProfessionalInformations';
import { ProfileContactCard } from '../../profile/ProfilePartCards/ProfileContactCard';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/features/headers/HeaderProfile/HeaderProfile';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { useSelectSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();
  const showProfileExperiences =
    selectedProfile.role === UserRoles.CANDIDATE ||
    (selectedProfile.experiences && selectedProfile.experiences.length > 0);
  const showProfileFormations =
    selectedProfile.role === UserRoles.CANDIDATE ||
    (selectedProfile.formations && selectedProfile.formations.length > 0);

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={selectedProfile.id}
        isAvailable={selectedProfile.isAvailable}
        firstName={selectedProfile.firstName}
        lastName={selectedProfile.lastName}
        role={selectedProfile.role}
        department={selectedProfile.department}
        introduction={selectedProfile.introduction}
        hasPicture={selectedProfile.hasPicture}
      />
      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledProfileLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileProfessionalInformations
              userFirstName={selectedProfile.firstName}
              sectorOccupations={selectedProfile.sectorOccupations}
              description={selectedProfile.description}
              skills={selectedProfile.skills}
              role={selectedProfile.role}
              currentJob={selectedProfile.currentJob}
              company={selectedProfile.company}
            />
            {selectedProfile.customNudges.length > 0 &&
              selectedProfile.role === UserRoles.CANDIDATE && (
                <ProfileCustomNudges
                  customNudges={selectedProfile.customNudges}
                  firstName={selectedProfile.firstName}
                  role={selectedProfile.role}
                  userId={selectedProfile.id}
                  ownProfile
                />
              )}
            {showProfileExperiences && (
              <ProfileExperiences
                userId={selectedProfile.id}
                userFirstName={selectedProfile.firstName}
                userRole={selectedProfile.role}
                experiences={selectedProfile.experiences}
              />
            )}
            {showProfileFormations && (
              <ProfileFormations
                userId={selectedProfile.id}
                userFirstName={selectedProfile.firstName}
                userRole={selectedProfile.role}
                formations={selectedProfile.formations}
              />
            )}
            {/* <ProfileReviews
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              reviews={selectedProfile.reviews ?? []}
            /> */}
          </StyledProfileLeftColumn>
          <StyledProfileRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileContactCard
              userId={selectedProfile.id}
              averageDelayResponse={selectedProfile.averageDelayResponse}
              firstName={selectedProfile.firstName}
              role={selectedProfile.role}
              isAvailable={selectedProfile.isAvailable}
            />
            {selectedProfile.role === UserRoles.CANDIDATE && (
              <ProfileContracts
                contracts={selectedProfile.contracts}
                smallCard
              />
            )}
            <ProfileInterests interests={selectedProfile.interests} smallCard />
            <ProfileLanguages
              userProfileLanguages={selectedProfile.userProfileLanguages}
              smallCard
            />
            <ProfileDocuments
              userId={selectedProfile.id}
              linkedinUrl={selectedProfile.linkedinUrl}
              hasExternalCv={selectedProfile.hasExternalCv}
              smallCard
            />
            <ProfileContactPreferences
              userRole={selectedProfile.role}
              smallCard
            />
            <ProfileNudges
              userRole={selectedProfile.role}
              nudges={selectedProfile.nudges}
              smallCard
            />
          </StyledProfileRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
