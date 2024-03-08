import React from 'react';
import { MultipleCTA } from 'src/components/partials/MultipleCTA';
import { NewsletterPartial } from 'src/components/partials/NewsletterPartial';
import { SharePartial } from 'src/components/partials/SharePartial';
import { Grid, Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const datas = [
  {
    button: {
      href: '/aider',
      label: 'Aider les candidats',
    },
    title: 'Vous êtes un particulier',
  },
  {
    button: {
      href: '/entreprises',
      label: "S'engager dans l'inclusion",
    },
    title: 'Vous êtes une entreprise',
  },
  {
    button: {
      href: '/orienter',
      label: 'Orienter des candidats',
    },
    title: 'Vous êtes un acteur de l’insertion sociale ou professionnelle',
  },
  {
    button: {
      href: '/travailler',
      label: 'Rejoindre Entourage Pro',
    },
    title: 'Vous cherchez du travail',
  },
];

export const ActionPartial = ({
  style = 'default',
}: {
  style?: 'default' | 'muted';
}) => {
  return (
    <Section style={style} id="actions">
      <Grid gap="large" column center>
        <div className="uk-text-center uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold">
            <span className="uk-text-primary">Agissez</span> avec Entourage Pro
          </h2>
          <div className="uk-container-small">
            Depuis son lancement en juin 2019, le programme Entourage Pro a
            permis aux bénéficiaires mais aussi aux bénévoles et aux entreprises
            de faire des rencontres qui ont changé leur vie.
          </div>
        </div>
        <MultipleCTA
          data={datas}
          spacing="small"
          className="uk-margin-large-bottom"
        />
        <NewsletterPartial
          padding={false}
          style={style}
          tag={GA_TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC}
        />
        <SharePartial />
      </Grid>
    </Section>
  );
};
