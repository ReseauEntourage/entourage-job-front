import React from 'react';
import LogoList from 'src/components/partials/LogoList';
import Layout from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';
import ImageTitle from 'src/components/partials/ImageTitle';
import Reviews from 'src/components/partials/Reviews';
import HowToCommitDifferently from 'src/components/partials/HowToCommitDifferently';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';
import PARTNERS from 'src/constants/partners';
import { IconNoSSR } from 'src/components/utils/Icon';
import { Chapter } from 'src/components/partials/Chapter';
import CVList from 'src/components/cv/CVList';
import { CV_FILTERS_DATA } from 'src/constants';
import Timeline from 'src/components/partials/Timeline';
import NumberGrid from 'src/components/partials/NumberGrid';
import AnimatedList from 'src/components/utils/AnimatedList';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { openModal } from 'src/components/modals/Modal';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import Api from 'src/Axios';
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

const numbers = [
  {
    value: 230,
    description: 'Candidats accompagnés depuis le lancement',
    animate: true,
  },
  {
    value: '61%',
    description:
      'Des candidats parvenus au bout du parcours ont retrouvé un travail',
  },
  { value: 73, description: 'Entreprises ayant recruté', animate: true },
  {
    value: '93%',
    description:
      'Des candidats ont repris confiance en eux et en leurs capacités',
  },
];

const openContactModal = () => {
  gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
  fbEvent(FB_TAGS.COMPANY_CONTACT);
  openModal(
    <ModalGeneric>
      <iframe
        className="airtable-embed"
        src={`${process.env.AIRTABLE_LINK_COMPANY_HELP}?backgroundColor=blue`}
        frameBorder="0"
        title="modal-company-help"
        width="100%"
        height="533"
        style={{
          background: 'transparent',
          border: '1px solid #ccc;',
        }}
      />
    </ModalGeneric>
  );
};

const Entreprises = ({ nbPublishedCVs }) => {
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
            Contactez-nous&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        }
      />
      <Chapter
        smallTitle
        style="default"
        title={
          <>
            <span className="uk-text-primary">Pourquoi recruter</span> avec
            LinkedOut&nbsp;?
          </>
        }
        content={
          <>
            <AnimatedList
              items={[
                <>
                  <span className="uk-text-bold">
                    Agir concrètement en faveur de l’inclusion
                  </span>
                  <br />
                  Le recrutement est l’expérience la plus impactante et
                  transformante pour votre entreprise
                </>,
                <>
                  <span className="uk-text-bold">
                    Soutenir la transformation de votre entreprise
                  </span>
                  <br />
                  Vous investissez dans la performance à long terme de votre
                  équipe
                </>,
                <>
                  <span className="uk-text-bold">
                    Engager vos collaborateurs
                  </span>{' '}
                  dans une démarche d’inclusion
                  <br />
                  Vous embarquez dans un projet collectif tout en renforçant
                  votre marque employeur
                </>,
                <>
                  <span className="uk-text-bold">
                    Répondre à vos besoins en recrutement
                  </span>
                  <br />
                  Vous identifiez et rencontrez de nouveaux profils, sur tous
                  types de métiers
                </>,
              ]}
            />
          </>
        }
        imgSrc="/static/img/company_why.jpg"
        animate={false}
        direction="right"
        cta={
          <Button
            onClick={openContactModal}
            style="secondary"
            className="uk-margin-medium-top"
          >
            Contactez-nous&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        }
      />
      <Chapter
        smallTitle
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
        smallTitle
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
            <AnimatedList
              items={[
                <>
                  <span className="uk-text-bold">L&apos;absence de réseau</span>{' '}
                  et le fait d&apos;avoir vécu la précarité et/ou
                  l&apos;exclusion
                </>,
                <>
                  <span className="uk-text-bold">
                    Une grande motivation pour trouver un emploi stable
                  </span>{' '}
                  et construire un avenir
                </>,
                <>
                  <span className="uk-text-bold">
                    La capacité à travailler :
                  </span>{' '}
                  les freins à l’emploi ont été levés
                </>,
              ]}
            />
          </>
        }
        animate={false}
        direction="column"
      />
      <Section container="large" style="muted">
        <h3 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          {nbPublishedCVs || 'De nombreux'} candidats cherchent actuellement un
          emploi
        </h3>
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
        <h3 className="uk-text-bold uk-text-left uk-margin-medium-bottom uk-margin-remove-top">
          <span className="uk-text-primary">L&apos;accompagnement</span>{' '}
          LinkedOut à chaque étape
        </h3>
        <Timeline items={timeline} />
      </Section>
      <Section style="default">
        <h3 className="uk-text-bold uk-text-left uk-margin-medium-bottom uk-margin-remove-top">
          Notre impact <span className="uk-text-primary">en chiffres</span>
        </h3>
        <NumberGrid numbers={numbers} />
      </Section>
      <Reviews />
      <Section style="default">
        <h3 className="uk-text-center uk-text-bold">
          <span className="uk-text-primary">Ils ont recruté</span> avec
          LinkedOut
        </h3>
        <LogoList logos={PARTNERS.hired} carousel />
      </Section>
      <HowToCommitDifferently />
      <Section style="primary">
        <h3 className="uk-text-center uk-text-bold">
          Envie d&apos;en savoir plus sur le recrutement inclusif avec
          LinkedOut&nbsp;?
        </h3>
        <div className="uk-flex uk-flex-center">
          <Button
            onClick={openContactModal}
            style="secondary"
            className="uk-margin-small-top"
          >
            Contactez-nous&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <NewsletterPartial style="default" />
    </Layout>
  );
};

Entreprises.getInitialProps = async () => {
  return Api.get(`/cv/published`)
    .then(({ data: { nbPublishedCVs } }) => {
      return {
        nbPublishedCVs,
      };
    })
    .catch((err) => {
      console.log(err);
      return { nbPublishedCVs: null };
    });
};

Entreprises.propTypes = {
  nbPublishedCVs: PropTypes.number,
};

Entreprises.defaultProps = {
  nbPublishedCVs: undefined,
};
export default Entreprises;
