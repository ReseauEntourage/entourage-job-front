import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AccordionGroup } from '@/src/components/ui/Accordion/AccordionGroup';
import { H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { CompletionStatus } from './CompletionStatus';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
  StyledProfileSubHeader,
} from './Content.styles';

export const Content = () => {
  return (
    <>
      <StyledProfileSubHeader>
        <Text>Les champs marqués d’un astérisque (*) sont obligatoires</Text>
        <CompletionStatus completion={75} />
      </StyledProfileSubHeader>

      <br />
      <br />
      <AccordionGroup>
        <Accordion
          headerContent={
            <StyledAccordionHeader>
              <StyledAccordionHeaderIcon>
                <LucidIcon
                  name="User"
                  stroke="bold"
                  color={COLORS.white}
                  size={24}
                />
              </StyledAccordionHeaderIcon>
              <StyledAccordionHeaderTitleContainer>
                <H4 title="Informations personnelles" noMarginBottom />
                <Text>Photos et présentation</Text>
              </StyledAccordionHeaderTitleContainer>
            </StyledAccordionHeader>
          }
          defaultOpen={true}
        >
          Contenu
        </Accordion>

        <Accordion
          headerContent={
            <StyledAccordionHeader>
              <StyledAccordionHeaderIcon>
                <LucidIcon name="Briefcase" color={COLORS.white} size={24} />
              </StyledAccordionHeaderIcon>
              <StyledAccordionHeaderTitleContainer>
                <H4 title="Informations professionnelles" noMarginBottom />
                <Text>Expérience et compétences</Text>
              </StyledAccordionHeaderTitleContainer>
            </StyledAccordionHeader>
          }
          defaultOpen={false}
        >
          Contenu
        </Accordion>

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
        >
          Contenu
        </Accordion>
      </AccordionGroup>
    </>
  );
};
