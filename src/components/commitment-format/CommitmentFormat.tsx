import React from 'react';
import { StyledBackofficeBackground } from '@/src/components/backoffice/Backoffice.styles';
import {
  CommitmentFormatCards,
  CommitmentFormatCta,
  CommitmentFormatCtaBtn,
} from '@/src/components/commitment-format/CommitmentFormat.styles';
import { HeaderBackoffice } from '@/src/components/headers/HeaderBackoffice';
import { Section } from '@/src/components/utils';
import { COMMITMENT_FORMATS } from '@/src/constants/commitmentFormat';
import { LayoutBackOffice } from '../backoffice/LayoutBackOffice';
import { CommitmentFormatCard } from './CommitmentFormatCard';

export const CommitmentFormat = () => (
  <LayoutBackOffice title="Formats d'engagement">
    <StyledBackofficeBackground>
      <Section className="custom-page">
        <HeaderBackoffice
          title="Découvrez tous les formats d’engagement"
          description="Engagez-vous auprès de la cause du lien social, un enjeu de société central dans le contexte socio-économique actuel. Développez les compétences et connaissances de vos collaborateurs. Engagez votre entreprise dans une démarche d’inclusion, en changeant le regard de vos collaborateurs sur la précarité. Renforcez la cohésion entre collègues et l’esprit d’équipe. Renforcez votre marque employeur et fidélisez vos talents."
        />
        <CommitmentFormatCards>
          {COMMITMENT_FORMATS.map((format) => (
            <CommitmentFormatCard key={format.id} commitmentFormat={format} />
          ))}
        </CommitmentFormatCards>
        <CommitmentFormatCta>
          <CommitmentFormatCtaBtn type="button">
            Découvrir les formats
          </CommitmentFormatCtaBtn>
        </CommitmentFormatCta>
      </Section>
    </StyledBackofficeBackground>
  </LayoutBackOffice>
);
