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
import { Typography } from 'src/components/utils/Typography';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { pageContent } = useConfirmation();

  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <EntourageProLogoPrimary width={226} height={78} />

        <Card title={pageContent.title}>
          <StyledReferingSubtitle>
            <Typography weight="normal">{pageContent.subtitle}</Typography>
          </StyledReferingSubtitle>
          {pageContent.bullets.map(({ icon, title, text }) => (
            <StyledReferingListItem key={title}>
              <StyledReferingListItemIcon>{icon}</StyledReferingListItemIcon>
              <StyledReferingListItemLabels>
                <H6 title={title} color="primaryBlue" />
                <Typography size="small">{text}</Typography>
              </StyledReferingListItemLabels>
            </StyledReferingListItem>
          ))}
          <StyledReferingButtonContainer>
            <Button style="custom-secondary-inverted" href="/login">
              Retourner à mon espace
            </Button>
          </StyledReferingButtonContainer>
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
}
