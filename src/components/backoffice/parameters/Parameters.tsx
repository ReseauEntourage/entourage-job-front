import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { useConfirmationToaster } from '../parametres-old/useConfirmationToaster';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { ProfileChangePassword } from 'src/components/profile/ProfilePartCards/ProfileChangePassword/ProfileChangePassword';
import { ProfileContactPreferences } from 'src/components/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from 'src/components/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileCustomHelpsAndOffers } from 'src/components/profile/ProfilePartCards/ProfileCustomHelpsAndOffers/ProfileCustomHelpsAndOffers';
import { ProfileDocuments } from 'src/components/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from 'src/components/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from 'src/components/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileGeneratedDescription } from 'src/components/profile/ProfilePartCards/ProfileGeneratedDescription/ProfileGeneratedDescription';
import { ProfileHelpsAndOffers } from 'src/components/profile/ProfilePartCards/ProfileHelpsAndOffers/ProfileHelpsAndOffers';
import { ProfileInterests } from 'src/components/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from 'src/components/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileNotificationsPreferences } from 'src/components/profile/ProfilePartCards/ProfileNotificationsPreferences/ProfileNotificationsPreferences';
import { ProfilePersonalInformations } from 'src/components/profile/ProfilePartCards/ProfilePersonalInformations/ProfilePersonalInformations';
import { ProfileReviews } from 'src/components/profile/ProfilePartCards/ProfileReviews/ProfileReviews';
import { ProfileSkills } from 'src/components/profile/ProfilePartCards/ProfileSkills/ProfileSkills';
import { ProfileStats } from 'src/components/profile/ProfilePartCards/ProfileStats/ProfileStats';
import { Section } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { InviteToUploadCv } from './InviteToUploadCv/InviteToUploadCv';
import {
  StyledParametersLeftColumn,
  StyledParametersRightColumn,
  StyledParametersSectionContent,
} from './Parameters.styles';

export const Parameters = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  useConfirmationToaster();

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        description={user.userProfile.description ?? ''}
        role={user.role}
        department={user.userProfile.department}
        isAvailable={user.userProfile.isAvailable}
        phone={user.phone}
        email={user.email}
        driverLicenses={['AM', 'A', 'B', 'C', 'D', 'E']}
        isEditable
      />
      <Section className="custom-page">
        <StyledParametersSectionContent>
          <InviteToUploadCv />
          <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
            <StyledParametersLeftColumn
              className={`${isDesktop ? '' : 'mobile'}`}
            >
              <ProfilePersonalInformations
                occupations={user.userProfile.occupations ?? []}
                businessSectors={user.userProfile.businessSectors ?? []}
                isEditable
              />
              <ProfileGeneratedDescription isEditable />
              <ProfileSkills
                skills={user.userProfile.skills || []}
                isEditable
              />
              <ProfileCustomHelpsAndOffers
                isEditable
                items={['item1', 'item2']}
                firstName={user.firstName}
                role={user.role}
                id={user.id}
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
                languages={user.userProfile.languages}
                isEditable
                smallCard
              />
              <ProfileInterests interests={[]} isEditable smallCard />
              <ProfileContracts isEditable smallCard />
              <ProfileContactPreferences isEditable smallCard />
              <ProfileHelpsAndOffers role={user.role} isEditable smallCard />
              <ProfileNotificationsPreferences isEditable smallCard />
              <ProfileStats smallCard />
              <ProfileChangePassword smallCard />
            </StyledParametersRightColumn>
          </StyledBackofficeGrid>
        </StyledParametersSectionContent>
      </Section>
    </StyledBackofficeBackground>
  );
};
