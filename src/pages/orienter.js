import React from 'react';
import Layout from 'src/components/Layout';
import { Section } from 'src/components/utils';
import Button from 'src/components/utils/Button';
import ImageTitle from 'src/components/partials/ImageTitle';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { openModal } from 'src/components/modals/Modal';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { Chapter } from 'src/components/partials/Chapter';
import AnimatedList from 'src/components/utils/AnimatedList';
import Reviews from 'src/components/partials/Reviews';
import LogoList from 'src/components/partials/LogoList';
import PARTNERS from 'src/constants/partners';
import NumberGrid from 'src/components/partials/NumberGrid';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-stephane-danny.jpg',
    author: 'Stéphane',
    authorStatus: 'Recruteur de Danny',
    company: 'Les copains de Bastien',
    review: (
      <>
        Bien plus qu&apos;un candidat standard,{' '}
        <span className="uk-text-primary">
          on sent qu&apos;il y a un enjeu personnel et une dimension
          impactante&nbsp;!
        </span>
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
    author: 'Grégoire',
    company: 'Dani Alu',
    authorStatus: "Recruteur de M'Bemba",
    review: (
      <>
        Le recrutement de M&apos;Bemba a ressoudé les équipes. Elles se sont
        investies dans un projet. Elles peuvent être très fières d’avoir fait en
        sorte que{' '}
        <span className="uk-text-primary">
          M&apos;Bemba soit épanoui et polyvalent dans l’atelier.
        </span>
      </>
    ),
  },
];

const numbers = [
  {
    value: '93%',
    description:
      "des candidats se déclarent remobilisés dans leur recherche d'emploi",
  },
  {
    value: '61%',
    description: 'des candidats retrouvent un emploi dans les 6 mois',
  },
  {
    value: '92%',
    description:
      'des structures sociales partenaires sont satisfaites de leur expérience',
  },
  {
    value: '100%',
    description:
      'des partenaires perçoivent LinkedOut comme un apport complémentaire',
  },
];

const Orienter = () => {
  return (
    <Layout title="Orienter - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_guide.jpg"
        id="guide-title"
        title={
          <mark>
            <span className="uk-text-primary">Travaillons ensemble</span> pour
            l&apos;accès&nbsp;à&nbsp;l’emploi
          </mark>
        }
        text={
          <>
            Vous accompagnez des personnes en situation d&apos;exclusion&nbsp;?
            Avec LinkedOut, accélérez leur retour à l’emploi&nbsp;!
            <br />
            Notre tremplin vers l’emploi en 6 mois s’inscrit dans la continuité
            de votre accompagnement.
          </>
        }
        cta={{
          label: 'Inscrire un candidat',
          href: `${process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}`,
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC);
            fbEvent(FB_TAGS.SOCIAL_WORKER_REGISTRATION);
          },
        }}
        secondCta={{
          label: 'Nous contacter',
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
            openModal(<ModalInterestLinkedOut />);
          },
        }}
      />
      <Section container="small" style="default">
        <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom">
          <span className="uk-text-primary">Ce qu&apos;apporte</span> LinkedOut
          à vos bénéficiaires
        </h2>
        <div className="uk-flex uk-flex-center uk-margin-small-bottom">
          <h3 className="uk-text-center">
            Des réseaux activés = plus d&apos;opportunités
          </h3>
        </div>
        <MultipleCTA
          animate
          spacing="large"
          data={[
            {
              img: '/static/img/illustrations/approved.png',
              title: 'Un CV humain et convaincant',
              text: "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
            },
            {
              img: '/static/img/illustrations/network.png',
              title: 'Une diffusion élargie du CV',
              text: ' Grâce aux partages du grand public sur les réseaux sociaux via la plateforme',
            },
            {
              img: '/static/img/illustrations/interview.png',
              title: 'Des recruteurs engagés',
              text: 'Un nouveau réseau d’entreprises mobilisées et accompagnées dans leur recrutement',
            },
          ]}
        />
        <div className="uk-flex uk-flex-center uk-margin-large-top uk-margin-small-bottom">
          <h3 className="uk-text-center">
            Un accompagnement innovant de 6 mois = des candidats plus confiants
          </h3>
        </div>
        <MultipleCTA
          animate
          spacing="large"
          data={[
            {
              img: '/static/img/illustrations/welcome.png',
              title: 'Un coaching personnalisé hebdomadaire',
              text: 'Avec un bénévole issu du milieu professionnel',
            },
            {
              img: '/static/img/illustrations/handshake.png',
              title: 'Des temps forts collectifs',
              text: 'Des expériences humaines formatrices, fédératrices et positives',
            },
          ]}
        />
        <div className="uk-flex uk-flex uk-flex-center uk-flex-wrap uk-margin-medium-top">
          <Button
            style="secondary"
            href={process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}
            isExternal
            newTab
            className="uk-margin-small-right uk-margin-small-left uk-margin-small-top"
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC);
              fbEvent(FB_TAGS.SOCIAL_WORKER_REGISTRATION);
            }}
          >
            Inscrire un candidat&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
          <div className="uk-light">
            <Button
              style="secondary"
              className="uk-margin-small-right uk-margin-small-left uk-margin-small-top"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
                openModal(<ModalInterestLinkedOut />);
              }}
            >
              Nous contacter&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Chapter
        smallTitle
        title={
          <>
            <span className="uk-text-primary">À qui</span> s&apos;adresse
            LinkedOut&nbsp;?
          </>
        }
        content={
          <>
            LinkedOut s&apos;adresse à des personnes motivées et en capacité de
            travailler, mais qui en raison d&apos;un parcours de vie difficile
            et les situations d&apos;exclusion rencontrées, peinent à retrouver
            un emploi par leurs propres moyens.
            <br />
            <br />
            Nos candidats sont&nbsp;:
            <br />
            <AnimatedList
              items={[
                <>
                  <span className="uk-text-bold">
                    Domiciliés à Paris, dans le 92 et le 93, à Lille, à Lyon ou
                    à Lorient
                  </span>
                </>,
                <>
                  <span className="uk-text-bold">
                    Disponibles pour travailler immédiatement
                  </span>{' '}
                  et consacrer du temps à la recherche d’emploi
                </>,
                <>
                  <span className="uk-text-bold">
                    Suffisamment à l&apos;aise en Français
                  </span>{' '}
                  pour passer un entretien d&apos;embauche
                </>,
              ]}
            />
          </>
        }
        imgSrc="/static/img/orientation_who.jpg"
        animate
        direction="left"
        style="default"
        cta={
          <Button
            style="secondary"
            href={process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}
            isExternal
            newTab
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC);
              fbEvent(FB_TAGS.SOCIAL_WORKER_REGISTRATION);
            }}
          >
            Inscrire un candidat&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        }
      />
      <Reviews
        reviews={reviews}
        title={
          <>
            Plus de{' '}
            <span className="uk-text-primary">60 entreprises partenaires</span>{' '}
            ont fait confiance à LinkedOut
          </>
        }
      />
      <Section style="default">
        <h2 className="uk-text-center uk-text-bold uk-margin-medium-bottom">
          <span className="uk-text-primary">Ils travaillent</span> avec
          LinkedOut
        </h2>
        <LogoList logos={PARTNERS.ORIENTATION} carousel />
      </Section>
      <Section style="default">
        <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Notre <span className="uk-text-primary">impact</span>
        </h2>
        <NumberGrid numbers={numbers} numbersPerRow={4} />
        <div className="uk-flex uk-flex-center">
          <p className="uk-text-muted uk-text-italic uk-margin-remove-bottom uk-margin-medium-top">
            Source&nbsp;: Mesure d&apos;impact 2021 Archipel & Co
          </p>
        </div>
      </Section>
      <Section container="large" style="muted">
        <h2 className="uk-text-center uk-text-bold uk-margin-medium-bottom">
          Vous souhaitez <span className="uk-text-primary">en savoir plus</span>{' '}
          sur LinkedOut&nbsp;?
        </h2>
        <div className="uk-flex uk-flex uk-flex-center uk-flex-wrap uk-margin-medium-top">
          <Button
            style="secondary"
            className="uk-margin-small-right uk-margin-small-left uk-margin-small-top"
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
              openModal(<ModalInterestLinkedOut />);
            }}
          >
            Nous contacter&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
          <div className="uk-light">
            <Button
              style="secondary"
              href={process.env.ASSOCIATION_BROCHURE}
              isExternal
              newTab
              className="uk-margin-small-right uk-margin-small-left uk-margin-small-top"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_ORIENTER_BROCHURE_CLIC);
              }}
            >
              Télécharger la brochure&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </div>
          {/*
            <Button
              style="secondary"
              href={process.env.ASSOCIATION_APPOINTMENT}
              isExternal
              newTab
              className="uk-margin-small-right uk-margin-small-left uk-margin-small-top"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_ORIENTER_APPOINTMENT_CLIC);
              }}
            >
              Prendre rendez-vous&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          */}
        </div>
      </Section>
    </Layout>
  );
};

export default Orienter;
