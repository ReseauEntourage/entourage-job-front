import React from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { UserWithUserCandidate } from 'src/api/types';
import { Button, ButtonIcon, ImgProfile, Section } from 'src/components/utils';
import { H1, H2, H5, H6 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledHeaderParametres,
  StyledHeaderParametresContent,
  StyledProfilePictureContainer,
  StyledTextContainer,
  StyledEditPictureIconContainer,
  StyledMobileTitlesContainer,
} from './HeaderParametres.styles';

export const HeaderParametres = ({
  userData,
}: {
  userData: UserWithUserCandidate;
}) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledHeaderParametres className={`${isDesktop ? '' : 'mobile'}`}>
      <Section>
        <StyledHeaderParametresContent>
          <StyledProfilePictureContainer
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            <ImgProfile user={userData} size={isDesktop ? 146 : 64} />
            {isDesktop ? (
              <Button style="custom-secondary">Modifier</Button>
            ) : (
              <StyledEditPictureIconContainer>
                <ButtonIcon icon={<EditIcon />} onClick={() => {}} />
              </StyledEditPictureIconContainer>
            )}
          </StyledProfilePictureContainer>
          {isDesktop ? (
            <StyledTextContainer>
              <H1
                title={
                  <>
                    {userData.firstName} {userData.lastName}
                  </>
                }
                color="black"
              />
              {userData.zone && (
                <H5
                  title={
                    userData.zone?.charAt(0) +
                    userData.zone?.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
              {/* <p>to be done</p> */}
            </StyledTextContainer>
          ) : (
            <StyledMobileTitlesContainer>
              <H2
                title={
                  <>
                    {userData.firstName} {userData.lastName}
                  </>
                }
                color="black"
              />
              {userData.zone && (
                <H6
                  title={
                    userData.zone.charAt(0) +
                    userData.zone.slice(1).toLowerCase()
                  }
                  color="black"
                />
              )}
            </StyledMobileTitlesContainer>
          )}
        </StyledHeaderParametresContent>
      </Section>
    </StyledHeaderParametres>
  );
};
