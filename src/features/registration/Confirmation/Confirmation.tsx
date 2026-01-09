import React from 'react';
import { Button, Card } from '@/src/components/ui';
import { H6 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import {
  StyledRegistrationButtonContainer,
  StyledRegistrationContainer,
  StyledRegistrationListItem,
  StyledRegistrationListItemIcon,
  StyledRegistrationListItemLabels,
  StyledRegistrationSubtitle,
} from '../Registration.styles';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { pageContent } = useConfirmation();

  if (!pageContent) {
    console.error('No page content found for the confirmation step.');
    return null; // Handle the case where pageContent is not defined
  }

  return (
    <StyledRegistrationContainer>
      <Card title={pageContent.title}>
        <StyledRegistrationSubtitle>
          <Text weight="normal">{pageContent.subtitle}</Text>
        </StyledRegistrationSubtitle>
        {pageContent.bullets.map(({ icon, title, text }) => (
          <StyledRegistrationListItem key={title}>
            <StyledRegistrationListItemIcon>
              {icon}
            </StyledRegistrationListItemIcon>
            <StyledRegistrationListItemLabels>
              <H6 title={title} color="primaryBlue" />
              <Text size="small">{text}</Text>
            </StyledRegistrationListItemLabels>
          </StyledRegistrationListItem>
        ))}
        <StyledRegistrationButtonContainer>
          <Button variant="primary" rounded href="/login">
            Accéder à mon profil
          </Button>
        </StyledRegistrationButtonContainer>
      </Card>
    </StyledRegistrationContainer>
  );
}
