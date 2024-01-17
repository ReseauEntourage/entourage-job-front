import React from 'react';
import {
  StyledHeaderProfile,
  StyledHeaderProfileContent,
  StyledHeaderProfilePicture,
  StyledHeaderProfilePictureContainer,
  StyledHeaderProfileTextContainer,
  StyledMobileHeaderProfileTitlesContainer,
} from '../../Backoffice.styles';
import { useSelectedProfile } from '../useSelectedProfile';
import { ImgProfile, Section } from 'src/components/utils';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledHeaderProfileDescriptionParagraphe } from './HeaderProfile.styles';

export const HeaderProfile = () => {
  const isDesktop = useIsDesktop();
  const size = isDesktop ? 146 : 64;
  const { selectedProfile: profile } = useSelectedProfile();
  if (!profile) return null;
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
              <ImgProfile user={profile} size={size} />
            </StyledHeaderProfilePicture>
          </StyledHeaderProfilePictureContainer>
          {isDesktop ? (
            <StyledHeaderProfileTextContainer>
              <H1
                title={
                  <>
                    {profile.firstName} {profile.lastName}
                  </>
                }
                color="black"
              />
              {profile.zone && (
                <H5
                  title={
                    profile.zone?.charAt(0) +
                    profile.zone?.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
              <StyledHeaderProfileDescriptionParagraphe>
                {profile.description}
              </StyledHeaderProfileDescriptionParagraphe>
            </StyledHeaderProfileTextContainer>
          ) : (
            <StyledMobileHeaderProfileTitlesContainer>
              <H2
                title={
                  <>
                    {profile.firstName} {profile.lastName}
                  </>
                }
                color="black"
              />
              {profile.zone && (
                <H6
                  title={
                    profile.zone.charAt(0) + profile.zone.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
            </StyledMobileHeaderProfileTitlesContainer>
          )}
        </StyledHeaderProfileContent>
        {!isDesktop && (
          <StyledHeaderProfileDescriptionParagraphe>
            {profile.description}
          </StyledHeaderProfileDescriptionParagraphe>
        )}
      </Section>
    </StyledHeaderProfile>
  );
};
