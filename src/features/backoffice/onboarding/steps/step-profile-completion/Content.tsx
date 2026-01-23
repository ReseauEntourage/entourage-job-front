import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { AccordionGroup } from '@/src/components/ui/Accordion/AccordionGroup';
import { H4 } from '@/src/components/ui/Headings';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
} from './Content.styles';

export const Content = () => {
  return (
    <>
      <Text>Les champs marqués d’un astérisque (*) sont obligatoires</Text>
      <br />
      <br />
      <AccordionGroup>
        <Accordion
          headerContent={
            <StyledAccordionHeader>
              <StyledAccordionHeaderIcon>
                <LucidIcon name="User" stroke="bold" />
              </StyledAccordionHeaderIcon>
              <H4 title="1. Profil personnel" />
            </StyledAccordionHeader>
          }
          defaultOpen={true}
        >
          Contenu
        </Accordion>
      </AccordionGroup>
    </>
  );
};
