import React from 'react';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { PostPublicOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { TaxModal } from 'src/components/modals/PopupModal/TaxModal';
import { Impact } from 'src/components/partials/common/Impact';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { EntreprisesCVLIst } from 'src/components/partials/pages/Entreprises/EntreprisesCVList';
import { EntreprisesEnSavoirPlus } from 'src/components/partials/pages/Entreprises/EntreprisesEnSavoirPlus';
import { EntreprisesTextImage } from 'src/components/partials/pages/Entreprises/EntreprisesTextImages';
import { HowToCommitDifferently } from 'src/components/partials/pages/Entreprises/HowToCommitDifferently';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { STORAGE_KEYS } from 'src/constants';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { useMount } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

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
        est rassurés par le fait que Entourage est là pour nous accompagner. Si
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
    industry: '',
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
    <Layout title="Entreprises - Entourage Pro">
      <ImageTitle
        img="/static/img/header_pic_hire.jpg"
        title="Entourage Pro vous accompagne pour changer de regard sur l'inclusion"
        description={
          <>
            Notre objectif&nbsp;? Vous permettre de créer les conditions
            <br />
            d&apos;un recrutement inclusif réussi, au service
            <br />
            de la transformation de votre entreprise.
          </>
        }
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
              openModal(<PostPublicOpportunityModal />);
            },
            label: 'Créer une offre',
          },
        ]}
      />

      <EntreprisesTextImage element="pourquoi" />
      <EntreprisesTextImage element="quoi" />
      <EntreprisesTextImage element="qui" />

      <EntreprisesCVLIst nbPublishedCVs={nbPublishedCVs} />

      <Impact
        as="Company"
        gaEventTag={GA_TAGS.PAGE_ENTREPRISES_MESURE_D_IMPACT_CLICK}
        inviteToShowMore
        invertBgColor
      />

      <Reviews reviews={reviews} title="Ce que Entourage Pro leur a apporté" />

      <PartnersWorkingWithUs tag={GA_TAGS.PAGE_ENTREPRISES_PARTNERS_CLICK} />

      <HowToCommitDifferently />

      <EntreprisesEnSavoirPlus />

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
