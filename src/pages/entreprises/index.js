import React from 'react';
import LogoList from 'src/components/partials/LogoList';
import WhatItBringsToCompanies, {
  openContactModal,
} from 'src/components/partials/WhatItBringsToCompanies';
import Layout from 'src/components/Layout';
import { Button, Grid, Section } from 'src/components/utils';
import ImageTitle from 'src/components/partials/ImageTitle';
import HireCTA from 'src/components/partials/HireCTA';
import Reviews from 'src/components/partials/Reviews';
import HowToCommitDifferently from 'src/components/partials/HowToCommitDifferently';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';
import PARTNERS from 'src/constants/partners';
import { IconNoSSR } from 'src/components/utils/Icon';
import { Chapter } from 'src/components/partials/Chapter';
import CVList from 'src/components/cv/CVList';
import { CV_FILTERS_DATA } from 'src/constants';
import PropTypes from 'prop-types';

const timeline = [
  {
    text: 'Identifier un besoin en recrutement',
  },
  { text: 'Identifiez un candidat et déposez une offre' },
  { text: 'Préparez la rencontre avec le candidat' },
  { text: 'Rencontrez le candidat' },
  { text: "Préparez l'intégration" },
  { text: "Suivez l'intégration" },
];

const Timeline = ({ items }) => {
  return (
    <Grid
      middle
      gap="small"
      center
      childWidths={['1-3@m']}
      className="uk-background-default"
    >
      {items.map(({ text }, index) => {
        return (
          <>
            <div className="uk-margin-medium-right uk-visible@m">
              <div className="ent-timeline-number">{index + 1}</div>
              <div className="ent-timeline-arrow">
                <span>{text}</span>
              </div>
            </div>
            <div className="uk-hidden@m">
              <div className="ent-timeline-number">{index + 1}</div>
              <div className="ent-timeline-arrow ent-timeline-arrow-mobile">
                <span>{text}</span>
              </div>
            </div>
          </>
        );
      })}
    </Grid>
  );
};

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    })
  ).isRequired,
};

const Entreprises = () => {
  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            LinkedOut, le programme qui vous accompagne pour{' '}
            <span className="uk-text-primary">recruter inclusif</span>
          </>
        }
        text="LinkedOut est à vos côtés tout au long du processus de recrutement pour diversifier les profils de votre entreprise."
        cta={
          <Button
            onClick={openContactModal}
            style="secondary"
            className="uk-margin-small-top"
          >
            Contacter nous&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        }
      />
      <Chapter
        style="muted"
        title={
          <>
            <span className="uk-text-primary">Pourquoi recruter</span> avec
            LinkedOut&nbsp;?
          </>
        }
        content={
          <>
            <ul
              uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
              className="uk-list uk-list-disc uk-margin-remove-bottom"
            >
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    Agir concrètement en faveur de l’inclusion
                  </span>
                  <br />
                  Le recrutement est l’expérience la plus impactante et
                  transformante pour votre entreprise
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    Soutenir la transformation de votre entreprise
                  </span>
                  <br />
                  Vous investissez dans la performance à long terme de votre
                  équipe
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    Engager vos collaborateurs
                  </span>{' '}
                  dans une démarche d’inclusion
                  <br />
                  Vous embarquez dans un projet collectif tout en renforçant
                  votre marque employeur
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    Répondre à vos besoins en recrutement
                  </span>
                  <br />
                  Vous identifiez et rencontrez de nouveaux profils, sur tous
                  types de métiers
                </span>
              </li>
            </ul>
          </>
        }
        imgSrc="/static/img/company_why.jpg"
        animate={false}
        direction="left"
        cta={
          <Button
            onClick={openContactModal}
            style="secondary"
            className="uk-margin-small-top"
          >
            Contacter nous&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        }
      />
      <Chapter
        title={
          <>
            En quoi consiste le{' '}
            <span className="uk-text-primary">recrutement inclusif</span>&nbsp;?
          </>
        }
        content={
          <>
            Recruter inclusif, c’est donner la chance à une personne en dehors
            des canaux traditionnels d’intégrer votre entreprise et créer les
            conditions pour l’intégrer durablement. Concrètement, vous adaptez
            votre processus de recrutement et l’intégration de la personne.
            LinkedOut vous accompagne tout au long pour faire de ce recrutement
            un succès.
          </>
        }
        imgSrc="/static/img/company_what.jpg"
        animate
        direction="right"
        style="default"
      />
      <Chapter
        style="default"
        title={
          <>
            Qui sont{' '}
            <span className="uk-text-primary">nos candidats&nbsp;?</span>
          </>
        }
        content={
          <>
            L’équipe LinkedOut s&apos;appuie sur des partenaires locaux et des
            associations pour identifier et sélectionner des personnes absentes
            de vos canaux habituels. Les candidats LinkedOut ont des profils
            très variés en termes de parcours, d&apos;âge, d&apos;expérience,
            mais ont tous en commun&nbsp;:
            <br />
            <ul
              uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
              className="uk-list uk-list-disc uk-margin-remove-bottom"
            >
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">L&apos;absence de réseau</span>{' '}
                  et le fait d&apos;avoir vécu la précarité et/ou
                  l&apos;exclusion
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    Une grande motivation pour trouver un emploi stable
                  </span>{' '}
                  et construire un avenir
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    La capacité à travailler :
                  </span>{' '}
                  les freins à l’emploi ont été levés
                </span>
              </li>
            </ul>
          </>
        }
        animate={false}
        direction="column"
      />
      <Section container="large" style="muted">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          XX candidats cherchent actuellement un emploi
        </h2>
        <CVList
          hideSearchBar
          nb={3}
          filters={{
            [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants,
          }}
        />
        <div className="uk-flex uk-flex-center uk-margin-medium-top">
          <Button
            href={{ pathname: '/candidats', query: { employed: false } }}
            style="secondary"
          >
            Découvrir nos candidats <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <Section style="default">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          L&apos;accompagnement LinkedOut à chaque étape
        </h2>
        <Timeline items={timeline} />
      </Section>
      <HireCTA />
      <WhatItBringsToCompanies />
      <Section style="muted">
        <h2 className="uk-text-center uk-text-bold">
          Ils ont <span className="uk-text-primary">déjà recruté</span>
        </h2>
        <LogoList logos={PARTNERS.hired} />
      </Section>
      <Reviews />
      <HowToCommitDifferently />
      <NewsletterPartial style="default" />
    </Layout>
  );
};

export default Entreprises;
