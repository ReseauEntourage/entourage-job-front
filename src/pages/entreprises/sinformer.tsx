// no need to modify a lot, it will be changed soon

import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { CandidateTestimonies } from 'src/components/partials/pages/Entreprises/Sinformer/CandidateTestimonies';
import { CompanyTestimonies } from 'src/components/partials/pages/Entreprises/Sinformer/CompanyTestimonies';
import { HowToBeInclusive } from 'src/components/partials/pages/Entreprises/Sinformer/HowToBeInclusive';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { ContainerWithTextCentered, Section } from 'src/components/utils';
import { ContainerMarginY } from 'src/components/utils/Containers/ContainerMarginY';
import { H2 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

const Sinformer = () => {
  return (
    <Layout title="S'informer - Entourage Pro">
      <ImageTitle
        img="/static/img/header_pic_sinformer.jpg"
        title="Pourquoi et comment devenir une entreprise inclusive"
        description={
          <>
            En tant qu&apos;entreprise, comment agir concrètement en faveur de
            l&apos;inclusion&nbsp;? Entourage Pro propose plusieurs solutions
            selon vos besoins&nbsp;: sensibilisation de vos équipes, mécénat ou
            bien recrutement.
          </>
        }
        cta={{
          style: 'custom-secondary-inverted',
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
            openModal(<CompanyContactModal />);
          },
          label: 'Nous contacter',
        }}
      />
      <Section className="custom-blue-bg">
        <ContainerMarginY>
          <H2
            title={
              <>Engager mon entreprise dans l’inclusion : pourquoi&nbsp;?</>
            }
            center
          />
          <ContainerWithTextCentered>
            <ContainerMarginY>
              <p>
                Chacun devrait pouvoir avoir sa place dans l’entreprise et dans
                la société, c&lsquo;est la conviction d&lsquo;Entourage Pro.
              </p>
              <p>
                Il est temps de passer d’une logique d’insertion à une logique
                d’inclusion : ce n’est pas qu’aux personnes exclues de faire le
                chemin pour s’insérer mais aussi à l’entreprise de se
                transformer pour faire une place à tous.
              </p>
              <p>
                Bien sûr ce n’est pas toujours facile. Accueillir des personnes
                ayant eu des parcours de galère nécessite une capacité
                d’adaptation de tous les côtés. Pourtant vous avez beaucoup à y
                gagner&nbsp;!
              </p>
              <p>
                Vous allez non seulement transformer la vie de quelqu’un, mais
                également votre entreprise. Toutes les organisations qui se sont
                engagées dans l’inclusion témoignent des effets positifs que
                cela a provoqué chez elles : plus d’ouverture sur le monde,
                développement relationnel des salariés, une équipe qui se fédère
                autour d’un projet commun.
              </p>
              <p>
                Avec Entourage Pro, nous vous aidons à devenir une entreprise du
                monde d’après, qui apporte sa pierre dans la résolution des
                défis sociaux, et qui remet l’économie à l’endroit, au service
                de l’humain.
              </p>
            </ContainerMarginY>
          </ContainerWithTextCentered>
          <LiteYouTubeEmbed
            id="u3d3stVn1h0"
            title="Témoignage recruteur Entourage Pro"
            aspectWidth={1280}
            aspectHeight={720}
            params="rel=0&showinfo=0&iv_load_policy=3"
          />
        </ContainerMarginY>
      </Section>
      <CandidateTestimonies />
      <HowToBeInclusive />
      <CompanyTestimonies />
      {/* to be fixed */}
      {/* <Section
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
              text: 'Découvrez si un candidat Entourage Pro correspond à votre besoin ; ou contactez nos partenaires qui cherchent aussi des emplois pour leurs candidats.',
              button: {
                label: 'Recruter',
                href: '/candidats?employed=false',
                size: 'small',
              },
            },
          ]}
          showHorizontalDividers
          className="uk-margin-large-bottom"
        />
      </Section>  */}
      <NewsletterPartial
        tag={GA_TAGS.PAGE_ENTREPRISES_INSCRIPTION_NEWSLETTER_CLIC}
      />
    </Layout>
  );
};

export default Sinformer;
