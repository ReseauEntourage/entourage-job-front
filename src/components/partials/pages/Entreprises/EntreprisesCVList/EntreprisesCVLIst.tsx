import React from 'react';
import { CVList } from 'src/components/partials/CV/CVList';
import {
  Button,
  Section,
  StyledCenteredButtonContainer,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledEntreprisesCVListContainer } from './EntreprisesCVList.styles';

export const EntreprisesCVList = () => {
  return (
    <Section container="large" style="muted">
      <StyledEntreprisesCVListContainer>
        <H2 center title="Ces candidats cherchent actuellement un emploi" />
        <CVList hideSearchBar nb={3} />
        <StyledCenteredButtonContainer>
          <Button
            href="/candidats"
            variant="primary"
            rounded
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_ALL_CV_CLICK);
            }}
          >
            Découvrir nos candidats
          </Button>
        </StyledCenteredButtonContainer>
      </StyledEntreprisesCVListContainer>
    </Section>
  );
};
