import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { Button, ImgProfile, Section } from 'src/components/utils';
import { H1, H5 } from 'src/components/utils/Headings';
import {
  StyledHeaderParametres,
  StyledHeaderParametresContent,
  StyledProfilePictureContainer,
  StyledTextContainer,
} from './HeaderParametres.styles';

export const HeaderParametres = ({
  userData,
}: {
  userData: UserWithUserCandidate;
}) => {
  return (
    <StyledHeaderParametres>
      <Section>
        <StyledHeaderParametresContent>
          <StyledProfilePictureContainer>
            <ImgProfile user={userData} size={146} />
            <Button style="custom-secondary">Modifier</Button>
          </StyledProfilePictureContainer>
          <StyledTextContainer>
            <H1
              title={
                <>
                  {userData.firstName} {userData.lastName}
                </>
              }
              color="black"
            />
            <H5
              title={
                userData.zone.charAt(0) + userData.zone.slice(1).toLowerCase()
              }
              color="black"
            />
            {/* <p>to be done</p> */}
          </StyledTextContainer>
        </StyledHeaderParametresContent>
      </Section>
    </StyledHeaderParametres>
  );
};
