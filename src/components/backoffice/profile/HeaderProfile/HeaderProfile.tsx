import React from 'react';
import {
  StyledHeaderNameAndRole,
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfileDescription,
  StyledHeaderProfileNameContainer,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfileTextContainer,
  StyledMobileHeaderProfileTitlesContainer,
} from '../../Backoffice.styles';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { ImgProfile, Section, Tag } from 'src/components/utils';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag/AvailabilityTag';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledHeaderProfileDescriptionParagraphe } from './HeaderProfile.styles';

export const HeaderProfile = () => {
  const isDesktop = useIsDesktop();
  const size = isDesktop ? 146 : 64;
  const profile = useSelectSelectedProfile();

  const { contextualRole } = useContextualRole(profile.role);

  return (
    <StyledHeaderProfile className={`${isDesktop ? '' : 'mobile'}`}>
      <Section>
        <StyledHeaderProfileContent>
          <StyledHeaderProfilePictureContainer
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            <StyledHeaderProfilePicture
              size={size}
              className={isDesktop ? '' : 'isMobile'}
            >
              <ImgProfile
                user={{
                  role: profile.role,
                  firstName: profile.firstName,
                  id: profile.id,
                }}
                size={size}
              />
            </StyledHeaderProfilePicture>
          </StyledHeaderProfilePictureContainer>
          {isDesktop ? (
            <StyledHeaderProfileTextContainer>
              <StyledHeaderProfileNameContainer>
                <StyledHeaderNameAndRole isDesktop={isDesktop}>
                  <H1
                    title={
                      <>
                        {profile.firstName} {profile.lastName}
                      </>
                    }
                    color="black"
                  />
                  <Tag content={contextualRole} style="secondary" />
                </StyledHeaderNameAndRole>
                <AvailabilityTag isAvailable={profile.isAvailable} />
              </StyledHeaderProfileNameContainer>
              {profile.department && (
                <H5
                  title={
                    profile.department?.charAt(0) +
                    profile.department?.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
              <StyledHeaderProfileDescription>
                <StyledHeaderProfileDescriptionParagraphe>
                  &ldquo;{profile.description}&rdquo;
                </StyledHeaderProfileDescriptionParagraphe>
              </StyledHeaderProfileDescription>
            </StyledHeaderProfileTextContainer>
          ) : (
            <StyledMobileHeaderProfileTitlesContainer>
              <StyledHeaderNameAndRole isDesktop={isDesktop}>
                <H2
                  title={
                    <>
                      {profile.firstName} {profile.lastName}
                    </>
                  }
                  color="black"
                />
                <Tag content={contextualRole} style="secondary" />
              </StyledHeaderNameAndRole>
              {profile.department && (
                <H6
                  title={
                    profile.department.charAt(0) +
                    profile.department.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
            </StyledMobileHeaderProfileTitlesContainer>
          )}
        </StyledHeaderProfileContent>
        {!isDesktop && (
          <StyledHeaderProfileDescription>
            <AvailabilityTag isAvailable={profile.isAvailable} />
            <StyledHeaderProfileDescriptionParagraphe>
              &ldquo;{profile.description}&rdquo;
            </StyledHeaderProfileDescriptionParagraphe>
          </StyledHeaderProfileDescription>
        )}
      </Section>
    </StyledHeaderProfile>
  );
};
