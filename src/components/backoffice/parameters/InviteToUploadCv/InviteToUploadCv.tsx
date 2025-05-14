import React from 'react';
import { Alert, Button, Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledInviteToUploadCvContentContainer,
  StyledInviteToUploadCvContentLeft,
} from './InviteToUploadCv.styles';

export const InviteToUploadCv = () => {
  const isDesktop = useIsDesktop();
  return (
    <Alert
      variant="darkBlue"
      icon={<LucidIcon name="WandSparkles" size={40} color="white" />}
    >
      <StyledInviteToUploadCvContentContainer>
        <StyledInviteToUploadCvContentLeft>
          <Text color="white" weight="bold">
            Nouvelle fonctionnalité IA
          </Text>
          <Text color="white">
            Grâce aux informations de votre CV, nous complétons votre profil en
            quelques secondes
          </Text>
        </StyledInviteToUploadCvContentLeft>
        <Button variant="default" rounded>
          {isDesktop ? 'Importer mon CV' : 'Importer'}
        </Button>
      </StyledInviteToUploadCvContentContainer>
    </Alert>
  );
};
