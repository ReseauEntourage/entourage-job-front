import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import {
  StyledReferingButtonContainer,
  StyledReferingContainer,
  StyledReferingListItem,
  StyledReferingListItemIcon,
  StyledReferingListItemLabels,
  StyledReferingPage,
  StyledReferingSubtitle,
} from '../Refering.styles';
import { Button, Card } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { pageContent } = useConfirmation();

  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <EntourageProLogoPrimary width={226} height={78} />

        <Card title={pageContent.title}>
          <StyledReferingSubtitle>
            <Text weight="normal">{pageContent.subtitle}</Text>
          </StyledReferingSubtitle>
          {pageContent.bullets.map(({ icon, title, text }) => (
            <StyledReferingListItem key={title}>
              <StyledReferingListItemIcon>{icon}</StyledReferingListItemIcon>
              <StyledReferingListItemLabels>
                <H6 title={title} color="primaryBlue" />
                <Text size="small">{text}</Text>
              </StyledReferingListItemLabels>
            </StyledReferingListItem>
          ))}
          <StyledReferingButtonContainer>
            <Button variant="primary" rounded href="/login">
              Retourner à mon tableau de bord
            </Button>
          </StyledReferingButtonContainer>
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
}
