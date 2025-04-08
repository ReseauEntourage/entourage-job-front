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
import { Text } from 'src/components/utils/Text';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { pageContent } = useConfirmation();

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
