import React from 'react';
import { ProfileCustomNudges } from '@/src/components/profile/ProfilePartCards/ProfileCustomNudges/ProfileCustomNudges';
import { ProfileNudges } from '@/src/components/profile/ProfilePartCards/ProfileNudges/ProfileNudges';
import { ProfileContactCard } from '../../profile/ProfilePartCards/ProfileContactCard';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { ProfileContactPreferences } from 'src/components/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from 'src/components/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileDocuments } from 'src/components/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from 'src/components/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from 'src/components/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileInterests } from 'src/components/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from 'src/components/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileProfessionalInformations } from 'src/components/profile/ProfilePartCards/ProfileProfessionalInformations/ProfileProfessionalInformations';
import { ProfileReviews } from 'src/components/profile/ProfilePartCards/ProfileReviews/ProfileReviews';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { useSelectSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();

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
      />

      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledProfileLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileProfessionalInformations
              userFirstName={selectedProfile.firstName}
              sectorOccupations={selectedProfile.sectorOccupations}
              description={selectedProfile.description}
              skills={selectedProfile.skills}
            />
            <ProfileCustomNudges
              userProfileNudges={selectedProfile.userProfileNudges}
              firstName={selectedProfile.firstName}
              role={selectedProfile.role}
              id={selectedProfile.id}
              ownProfile
            />
            <ProfileExperiences
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              experiences={[]}
            />
            <ProfileFormations
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              formations={[]}
            />
            <ProfileReviews
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              reviews={selectedProfile.reviews ?? []}
            />
          </StyledProfileLeftColumn>
          <StyledProfileRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileContactCard
              userId={selectedProfile.id}
              averageDelayResponse={selectedProfile.averageDelayResponse}
              firstName={selectedProfile.firstName}
              role={selectedProfile.role}
              isAvailable={selectedProfile.isAvailable}
            />
            <ProfileContracts contracts={selectedProfile.contracts} smallCard />
            <ProfileInterests interests={selectedProfile.interests} smallCard />
            <ProfileLanguages languages={selectedProfile.languages} smallCard />
            <ProfileDocuments
              userId={selectedProfile.id}
              linkedinUrl={selectedProfile.linkedinUrl}
              hasExternalCv={selectedProfile.hasExternalCv}
              entourageProCv="/url/" // TODO: Add CvUrl
              smallCard
            />
            <ProfileContactPreferences smallCard />
            <ProfileNudges
              userRole={selectedProfile.role}
              userProfileNudges={selectedProfile.userProfileNudges}
              smallCard
            />
          </StyledProfileRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
