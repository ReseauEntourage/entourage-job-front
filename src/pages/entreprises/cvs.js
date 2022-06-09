import React from 'react';
import { gaEvent } from 'src/lib/gtag';
import { Button, Grid, Img, Section } from 'src/components/utils';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import SearchCandidates from 'src/components/partials/SearchCandidates';
import CorporateContact from 'src/components/partials/CorporateContactPartial';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';
import usePostPublicOfferModal from 'src/components/modals/usePostPublicOfferModal';
import { isSSR } from 'src/utils/isSSR';
import { fbEvent } from 'src/lib/fb';

const CVEntreprises = () => {
  const PublicOfferModal = usePostPublicOfferModal();

  return (
    <Layout title="CVs Entreprises - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_cvs.jpg"
        id="companies-title"
        title={
          <mark>
            <span className="uk-text-primary">Ils sont prêts</span> à
            travailler&nbsp;!
          </mark>
        }
        text={
          <>
            Pour une entreprise, il existe différentes manières de
            s&apos;engager pour l&apos;inclusion, mais le recrutement est sans
            doute l’expérience la plus transformante et impactante. <br />
            Vous avez un poste à pourvoir&nbsp;? Parcourez les CV de nos
            candidats et contactez-les&nbsp;!
          </>
        }
        cta={{
          onClick: () => {
            if (!isSSR) {
              document
                .getElementById('searchCandidates')
                .scrollIntoView({ behavior: 'smooth' });
            }
          },
          label: 'Découvrez les candidats',
        }}
        secondCta={{
          href: process.env.AIRTABLE_LINK_COMPANY_HELP,
          isExternal: true,
          newTab: true,
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
            fbEvent(FB_TAGS.COMPANY_CONTACT);
          },
          label: 'Nous contacter',
        }}
      />
      <div id="searchCandidates">
        <SearchCandidates style="muted" />
      </div>
      <Section style="default">
        <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <h3 className="uk-text-bold uk-margin-medium-bottom">
            Votre offre peut correspondre{' '}
            <span className="uk-text-primary">à plusieurs profils&nbsp;?</span>
          </h3>
          <Img
            className="uk-background-cover uk-background-center"
            src="/static/img/new_candidates.jpg"
            alt="Visages LinkedOut"
          />
          <Grid middle column gap="collapse">
            <Button
              className="uk-margin-medium-top"
              style="secondary"
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
                openModal(<PublicOfferModal />);
              }}
            >
              Déposez votre offre <IconNoSSR name="chevron-right" />
            </Button>
          </Grid>
        </div>
        <hr className="uk-margin-large-top uk-margin-large-bottom" />
        <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <h3 className="uk-text-bold">
            Vous n&apos;avez pas trouvé{' '}
            <span className="uk-text-primary">
              le profil correspondant&nbsp;?
            </span>
          </h3>
          <h4>
            D&apos;autres partenaires pourraient vous orienter des
            personnes&nbsp;!
          </h4>
          <Grid middle column gap="collapse">
            <Button
              className="uk-margin-medium-top"
              style="secondary"
              href="/entreprises/recruter-hors-linkedout"
            >
              Voir les partenaires&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </Grid>
        </div>
      </Section>
      <CorporateContact />
      <NewsletterPartial style="default" />
    </Layout>
  );
};

export default CVEntreprises;
