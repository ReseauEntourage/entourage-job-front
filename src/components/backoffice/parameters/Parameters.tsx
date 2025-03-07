import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { useConfirmationToaster } from '../parametres-old/useConfirmationToaster';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { GeneratedDescription } from 'src/components/profile/GeneratedDescription/GeneratedDescription';
import { KeySkills } from 'src/components/profile/KeySkills/KeySkills';
import { PersonalInformations } from 'src/components/profile/PersonalInformations/PersonalInformations';
import { ProfileCustomHelpsAndOffers } from 'src/components/profile/ProfileCustomHelpsAndOffers/ProfileCustomHelpsAndOffers';
import { ProfileDocuments } from 'src/components/profile/ProfileDocuments/ProfileDocuments';
import { Section } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useFetchCV } from 'src/hooks/useFetchCV';
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
  const { cv, error, loading } = useFetchCV(user.id);

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
        isEditable
      />
      {loading || error ? (
        <Spinner />
      ) : (
        <Section className="custom-page">
          <StyledParametersSectionContent>
            <InviteToUploadCv />
            <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
              <StyledParametersLeftColumn
                className={`${isDesktop ? '' : 'mobile'}`}
              >
                <PersonalInformations
                  ambitions={user.userProfile.searchAmbitions ?? []}
                  businessLines={user.userProfile.searchBusinessLines ?? []}
                  isEditable
                />
                <GeneratedDescription isEditable />
                <KeySkills skills={cv?.skills || []} isEditable />
                <ProfileDocuments
                  userId={user.id}
                  linkedinUrl={user.userProfile.linkedinUrl}
                  hasExternalCv={user.userProfile.hasExternalCv}
                  entourageProCv="/url/" // TODO: Add CvUrl
                  isEditable
                />
                <ProfileCustomHelpsAndOffers
                  isEditable
                  items={['item1', 'item2']}
                  firstName={user.firstName}
                  role={user.role}
                  id={user.id}
                />
              </StyledParametersLeftColumn>
              <StyledParametersRightColumn
                className={`${isDesktop ? '' : 'mobile'}`}
              >
                Right
              </StyledParametersRightColumn>
            </StyledBackofficeGrid>
          </StyledParametersSectionContent>
        </Section>
      )}
    </StyledBackofficeBackground>
  );
};
