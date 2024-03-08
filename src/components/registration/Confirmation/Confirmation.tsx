import React from 'react';
import {
  StyledRegistrationButtonContainer,
  StyledRegistrationContainer,
  StyledRegistrationListItem,
  StyledRegistrationListItemIcon,
  StyledRegistrationListItemLabels,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { Button, Card } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Typography } from 'src/components/utils/Typography';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { pageContent } = useConfirmation();

  return (
    <StyledRegistrationContainer>
      <Card title={pageContent.title}>
        <StyledRegistrationSubtitle>
          <Typography weight="normal">{pageContent.subtitle}</Typography>
        </StyledRegistrationSubtitle>
        {pageContent.bullets.map(({ icon, title, text }) => (
          <StyledRegistrationListItem key={title}>
            <StyledRegistrationListItemIcon>
              {icon}
            </StyledRegistrationListItemIcon>
            <StyledRegistrationListItemLabels>
              <H6 title={title} color="primaryOrange" />
              <Typography size="small">{text}</Typography>
            </StyledRegistrationListItemLabels>
          </StyledRegistrationListItem>
        ))}
        <StyledRegistrationButtonContainer>
          <Button style="custom-secondary-inverted" href="/login">
            Accéder à mon profil
          </Button>
        </StyledRegistrationButtonContainer>
      </Card>
    </StyledRegistrationContainer>
  );
}
