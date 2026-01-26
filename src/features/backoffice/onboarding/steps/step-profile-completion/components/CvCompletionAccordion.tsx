import React from 'react';
import { Alert, Button, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { H4, H5 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../Content.styles';

export const CvCompletionAccordion = () => {
  return (
    <Accordion
      headerContent={
        <StyledAccordionHeader>
          <StyledAccordionHeaderIcon>
            <LucidIcon name="FileText" color={COLORS.white} size={24} />
          </StyledAccordionHeaderIcon>
          <StyledAccordionHeaderTitleContainer>
            <H4 title="CV et informations complémentaires" noMarginBottom />
            <Text>Votre CV et informations complémentaires</Text>
          </StyledAccordionHeaderTitleContainer>
        </StyledAccordionHeader>
      }
      defaultOpen={false}
      keepContentMounted
    >
      <Alert
        variant={AlertVariant.Info}
        icon={
          <LucidIcon name="Sparkles" color={COLORS.primaryBlue} size={25} />
        }
      >
        <H5 title="Gagnez du temps avec l'IA" />
        <Text>
          Importez votre CV et laissez notre IA remplir automatiquement vos
          expériences, formations, compétences, langues et centres d’intérêt.
          Vous pourrez ensuite modifier ces informations si besoin.
        </Text>
      </Alert>
      <br />
      <Button
        style={{ display: 'block', width: '100%' }}
        variant="primary"
        rounded={false}
      >
        Gagner du temps en complétant mon profil à partir de mon CV existant
      </Button>
    </Accordion>
  );
};
