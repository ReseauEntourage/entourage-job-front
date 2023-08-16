import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import {
  MultipleCTA,
  CandidateTestimonies,
  CompanyTestimonies,
  NewsletterPartial,
  HowToBeInclusive,
} from 'src/components/partials';
import { ImageTitle } from 'src/components/partials/ImageTitle';
import { Section } from 'src/components/utils';
import { CONTACT_INFO, EXTERNAL_LINKS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

const Sinformer = () => {
  return (
    <Layout title="S'informer - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_sinformer.jpg"
        id="sinformer-title"
        title={
          <mark>
            Pourquoi et comment devenir une&nbsp;
            <span className="uk-text-primary">entreprise inclusive</span>
          </mark>
        }
        text={
          <>
            En tant qu&apos;entreprise, comment agir concrètement en faveur de
            l&apos;inclusion&nbsp;? LinkedOut propose plusieurs solutions selon
            vos besoins&nbsp;: sensibilisation de vos équipes, mécénat ou bien
            recrutement.
          </>
        }
        cta={{
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
            openModal(<CompanyContactModal />);
          },
          label: 'Nous contacter',
        }}
      />
      <Section style="muted" container="small">
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Engager</span> mon entreprise dans
          l’inclusion : pourquoi&nbsp;?
        </h2>
        <p className="uk-text-center">
          Chacun devrait pouvoir avoir sa place dans l’entreprise et dans la
          société, c’est la conviction de LinkedOut.
        </p>
        <p className="uk-text-center">
          Il est temps de passer d’une logique d’insertion à une logique
          d’inclusion : ce n’est pas qu’aux personnes exclues de faire le chemin
          pour s’insérer mais aussi à l’entreprise de se transformer pour faire
          une place à tous.
        </p>
        <p className="uk-text-center">
          Bien sûr ce n’est pas toujours facile. Accueillir des personnes ayant
          eu des parcours de galère nécessite une capacité d’adaptation de tous
          les côtés. Pourtant vous avez beaucoup à y gagner&nbsp;!
        </p>
        <p className="uk-text-center">
          <span className="uk-text-primary uk-text-bold">
            Vous allez non seulement transformer la vie de quelqu’un, mais
            également votre entreprise.
          </span>{' '}
          Toutes les organisations qui se sont engagées dans l’inclusion
          témoignent des effets positifs que cela a provoqué chez elles : plus
          d’ouverture sur le monde, développement relationnel des salariés, une
          équipe qui se fédère autour d’un projet commun.
        </p>
        <p className="uk-text-center">
          Avec LinkedOut, nous vous aidons à devenir une entreprise du monde
          d’après, qui apporte sa pierre dans la résolution des défis sociaux,
          et qui remet l’économie à l’endroit, au service de l’humain.
        </p>
        <div className="uk-margin-medium-top">
          <LiteYouTubeEmbed
            id="u3d3stVn1h0"
            title="Témoignage recruteur LinkedOut"
            aspectWidth={1280}
            aspectHeight={720}
          />
        </div>
      </Section>
      <CandidateTestimonies />
      <HowToBeInclusive />
      <CompanyTestimonies />
      <Section
        style="muted"
        container="small"
        className="uk-padding-remove-top"
      >
        <h2 className="uk-text-bold uk-text-center uk-margin-large-bottom">
          <span className="uk-text-primary">Des ressources</span>&nbsp;pour vous
          lancer
        </h2>
        <MultipleCTA
          spacing="medium"
          data={[
            {
              title: 'Se former à l’inclusion',
              text: 'Le Campus de l’inclusion propose des formations aux dirigeants d’organisations et vous aide à construire un plan d’action adapté à votre organisation.',
              button: {
                label: "Plus d'infos ici",
                href: EXTERNAL_LINKS.CAMPUS_INCLUSION,
                external: true,
                size: 'small',
              },
            },
            {
              title: <div>Sensibiliser ses collaborateurs</div>,
              text: 'Nous proposons des ateliers pour ouvrir le dialogue autour de ce sujet dans votre entreprise et initier une démarche parmi vos collaborateurs.',
              button: {
                label: 'Nous contacter',
                href: `mailto:${CONTACT_INFO.CORPORATE_CONTACT}`,
                external: true,
                size: 'small',
              },
            },
            {
              title: 'Agir dans son territoire',
              text: 'Les clubs La France Une Chance rassemblent dans chaque territoire les entreprises inclusives. Rejoignez votre club et découvrez les formes d’engagement locales.',
              button: {
                label: 'Retrouvez les clubs ici',
                href: EXTERNAL_LINKS.FRANCE_UNE_CHANCE,
                external: true,
                size: 'small',
              },
            },
            {
              title: (
                <div>
                  Prêt à<br />
                  recruter&nbsp;?
                </div>
              ),
              text: 'Découvrez si un candidat LinkedOut correspond à votre besoin ; ou contactez nos partenaires qui cherchent aussi des emplois pour leurs candidats.',
              button: {
                label: 'Recruter',
                href: '/candidats?employed=false',
                size: 'small',
              },
            },
          ]}
          showHorizontalDividers
        />
      </Section>
      <NewsletterPartial
        tag={GA_TAGS.PAGE_ENTREPRISES_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default Sinformer;
