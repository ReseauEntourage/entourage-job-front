import React from 'react';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { PostPublicOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { TaxModal } from 'src/components/modals/PopupModal/TaxModal';
import {
  LogoList,
  HowToCommitDifferently,
  Chapter,
  NumberGrid,
  Reviews,
  Timeline,
} from 'src/components/partials';
import { CVList } from 'src/components/partials/CV/CVList';
import { ImageTitle } from 'src/components/partials/ImageTitle';
import { NewsletterPartial } from 'src/components/partials/NewsletterPartial';
import { Button, Section, AnimatedList } from 'src/components/utils';
import { CV_FILTERS_DATA, STORAGE_KEYS } from 'src/constants';
import { PARTNERS } from 'src/constants/partners';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { useMount } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

const timeline = [
  {
    text: 'Identifiez un besoin en recrutement',
    icon: '/static/img/illustrations/loupe.png',
  },
  {
    text: 'Identifiez un candidat et déposez une offre',
    icon: '/static/img/illustrations/approved.png',
  },
  {
    text: 'Préparez la rencontre avec le candidat',
    icon: '/static/img/illustrations/preparation.png',
  },
  {
    text: 'Rencontrez le candidat',
    icon: '/static/img/illustrations/interview.png',
  },
  {
    text: "Préparez l'intégration",
    icon: '/static/img/illustrations/welcome.png',
  },
  { text: "Suivez l'intégration", icon: '/static/img/illustrations/suivi.png' },
];

const numbers = [
  {
    value: 400,
    description: 'candidats accompagnés depuis le lancement',
    animate: true,
  },
  {
    value: '72%',
    description:
      'des candidats parvenus au bout du parcours ont retrouvé un travail',
  },
  { value: 130, description: 'entreprises ont recruté', animate: true },
  {
    value: '93%',
    description:
      'des candidats ont repris confiance en eux et en leurs capacités',
  },
];

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-augustin-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review: (
      <>
        &ldquo;Par son expérience, il apporte quelque chose de radicalement
        différent. Si je pouvais embaucher 2 Kenny, je le ferais&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-francois-miah.jpg',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    companyInfo: '31 salariés',
    review: (
      <>
        &ldquo;Avec Miah c’est une réussite. Là où notre compétence s’arrête, on
        est rassurés par le fait que LinkedOut est là pour nous accompagner. Si
        on peut s’inscrire dans des actions comme celles-ci tout en gardant
        notre efficacité, en y ajoutant le sourire de quelqu’un qui a envie, on
        le fait&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-advens.jpg',
    author: 'Sylvie Lepoutre',
    authorStatus: 'Raison d’être & Projet d’entreprise',
    company: 'Advens',
    industry: 'partenaire LinkedOut',
    review: (
      <>
        &ldquo;Nous étions à mille lieux des problématiques des personnes en
        précarité. Maintenant, chez Advens, on entend des mots comme
        “résilience”, “deuxième chance”, “rebond”, “inclusion”. Les
        collaborateurs sont très fiers !&ldquo;
      </>
    ),
  },
];

const Entreprises = ({ nbPublishedCVs }: { nbPublishedCVs: number }) => {
  useMount(() => {
    const taxModalClosed = localStorage.getItem(STORAGE_KEYS.TAX_MODAL_CLOSED);
    if (process.env.SHOW_POPUP === 'true' && !taxModalClosed) {
      setTimeout(() => {
        openModal(<TaxModal />);
      }, 1500);
    }
  });

  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_hire.jpg"
        title="LinkedOut vous accompagne pour changer de regard sur l'inclusion"
        description="Notre objectif ? Vous permettre de créer les conditions d’un recrutement inclusif réussi, au service de la transformation de votre entreprise."
        cta={[
          {
            dataTest: 'button-contact-company-header',
            onClick: () => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
              fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
              linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              openModal(<CompanyContactModal />);
            },
            style: 'custom-secondary-inverted',
            label: 'Nous contacter',
          },
          {
            dataTest: 'button-offer-company-header',
            style: 'custom-secondary',
            isExternal: false,
            newTab: false,
            onClick: () => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_PROPOSER_OFFRE_CLIC);
              fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_OPEN);
              // linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              openModal(<PostPublicOpportunityModal />);
            },
            label: 'Créer une offre',
          },
        ]}
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
                    Répondre à vos besoins en recrutement
                  </span>
                  <br />
                  <span className="uk-text-small">
                    Vous identifiez et rencontrez de nouveaux profils, sur tous
                    types de métiers
                  </span>
                </>,
                <>
                  <span className="uk-text-bold">
                    Agir concrètement en faveur de l’inclusion
                  </span>
                  <br />
                  <span className="uk-text-small">
                    Il existe plusieurs façons pour une entreprise de s’engager
                    en faveur de l’inclusion. Nous pensons que le recrutement
                    est l&apos;expérience la plus impactante pour votre
                    entreprise en vous faisant vivre une rencontre unique, et en
                    vous offrant la possibilité de renouveler votre approche du
                    recrutement et de l&apos;intégration.
                  </span>
                </>,
                <>
                  <span className="uk-text-bold">
                    Engager vos collaborateurs dans une démarche d’inclusion
                  </span>
                  <br />
                  <span className="uk-text-small">
                    Vous embarquez dans un projet collectif tout en renforçant
                    votre marque employeur
                  </span>
                </>,
                <>
                  <span className="uk-text-bold">
                    Soutenir la transformation de votre entreprise
                  </span>
                  <br />
                  <span className="uk-text-small">
                    En donnant sa chance à une personne qui en a besoin et en
                    créant les conditions pour l&apos;accueillir, c&apos;est
                    vous-même qui allez vivre une transformation, enrichir votre
                    collectif et votre projet d’entreprise&nbsp;!
                  </span>
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
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
              fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
              linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              openModal(<CompanyContactModal />);
            }}
            dataTestId="button-company-first-section"
            style="custom-secondary-inverted"
          >
            Nous contacter&nbsp;
          </Button>
        }
      />
      <Chapter
        smallTitle
        title={
          <>
            Le <span className="uk-text-primary">recrutement inclusif</span>,
            c&apos;est quoi&nbsp;?
          </>
        }
        content={
          <>
            Recruter inclusif, c’est donner la chance à une personne en dehors
            des canaux traditionnels d’intégrer votre entreprise et créer les
            conditions pour l’intégrer durablement.
            <br />
            <br />
            Concrètement, vous adaptez votre processus de recrutement et
            l’intégration de la personne. LinkedOut vous guide et vous
            accompagne pour faire de ce recrutement un succès.
          </>
        }
        imgSrc="/static/img/company_what.jpg"
        animate
        direction="left"
        style="default"
        cta={
          <Button
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_PROPOSER_OFFRE_CLIC);
              fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_OPEN);
              // linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              openModal(<PostPublicOpportunityModal />);
            }}
            dataTestId="button-company-second-section"
            style="custom-secondary-inverted"
          >
            Créer une offre
          </Button>
        }
      />
      <Chapter
        smallTitle
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
                    La capacité à travailler&nbsp;:
                  </span>{' '}
                  les freins à l’emploi ont été levés
                </>,
              ]}
            />
          </>
        }
        imgSrc="/static/img/company_who.jpg"
        animate
        direction="right"
        style="default"
        cta={
          <Button
            href={{ pathname: '/candidats', query: { employed: false } }}
            style="custom-secondary-inverted"
          >
            Découvrir nos candidats
          </Button>
        }
      />
      <Section container="large" style="muted">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          <span className="uk-text-primary">
            {nbPublishedCVs || 'De nombreux'} candidats
          </span>{' '}
          cherchent actuellement un emploi
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
            style="custom-secondary-inverted"
          >
            Découvrir nos candidats
          </Button>
        </div>
      </Section>
      <Section style="default">
        <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          <span className="uk-text-primary">L&apos;accompagnement</span>{' '}
          LinkedOut à chaque étape
        </h2>
        <Timeline items={timeline} />
        <p className="uk-text-center uk-text-italic uk-margin-medium-top">
          Votre conseiller LinkedOut est présent pour vous accompagner à chaque
          étape et co-construire avec vous les conditions d’un recrutement
          réussi.
        </p>
      </Section>
      <Section style="default">
        <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Notre impact <span className="uk-text-primary">en chiffres</span>
        </h2>
        <NumberGrid numbers={numbers} numbersPerRow={4} />
      </Section>
      <Reviews reviews={reviews} title="Ce que LinkedOut leur a apporté" />
      <Section style="default">
        <h2 className="uk-text-center uk-text-bold uk-margin-medium-bottom">
          <span className="uk-text-primary">Ils ont recruté</span> avec
          LinkedOut
        </h2>
        <LogoList logos={PARTNERS.HIRED} carousel />
      </Section>
      <HowToCommitDifferently />
      <Section style="primary">
        <h2 className="uk-text-center uk-text-bold uk-margin-medium-bottom">
          Envie d&apos;en savoir plus sur le recrutement inclusif avec
          LinkedOut&nbsp;?
        </h2>
        <div className="uk-flex uk-flex-center">
          <Button
            dataTestId="button-contact-company-last-section"
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
              fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
              linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              openModal(<CompanyContactModal />);
            }}
            style="secondary"
            className="uk-margin-small-top"
          >
            Nous contacter
          </Button>
        </div>
      </Section>
      <NewsletterPartial
        style="default"
        tag={GA_TAGS.PAGE_ENTREPRISES_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

Entreprises.getInitialProps = async () => {
  return Api.getNbCVPublished()
    .then(({ data: { nbPublishedCVs } }) => {
      return {
        nbPublishedCVs,
      };
    })
    .catch((err) => {
      console.error(err);
      return { nbPublishedCVs: null };
    });
};
export default Entreprises;
