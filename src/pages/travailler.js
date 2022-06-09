import React from 'react';
import { CONTACT_INFO } from 'src/constants';
import { Section, SimpleLink, Button } from 'src/components/utils';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import HowToJoin from 'src/components/partials/HowToJoin';
import StepsToJoin from 'src/components/partials/StepsToJoin';
import Highlights from 'src/components/partials/Highlights';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import { fbEvent } from 'src/lib/fb';

const Travailler = () => {
  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_work.jpg"
        id="work-title"
        title={
          <mark>
            LinkedOut, un tremplin vers{' '}
            <span className="uk-text-primary">l’emploi</span>
          </mark>
        }
        text={
          <>
            Vous êtes dans une situation de précarité ou d’exclusion ? Vous avez
            un projet professionnel mais vous n’avez pas de réseau ?
          </>
        }
        cta={{
          onClick: () => {
            gaEvent(GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC);
            fbEvent(FB_TAGS.CANDIDATE_REGISTRATION);
          },
          href: process.env.AIRTABLE_LINK_JOIN_LINKEDOUT,
          label: 'Rejoindre LinkedOut',
          isExternal: true,
          newTab: true,
        }}
      />
      <Section id="introWork" container="small" style="muted">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h4
            className="uk-align-center uk-text-center"
            uk-scrollspy="cls:uk-animation-slide-bottom; target: > span; delay: 200;"
          >
            <span>
              LinkedOut vous propose{' '}
              <span className="uk-text-bold uk-text-primary">
                un parcours sur 6 mois
              </span>{' '}
              pour vous aider à trouver un emploi.
            </span>
            <br />
            <br />
            <span>
              Candidatez au programme à Paris, dans le 92 et 93, à Lille et
              Lyon.
            </span>
          </h4>
          <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
            <Button
              style="secondary"
              className="uk-margin-small-top"
              isExternal
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC);
                fbEvent(FB_TAGS.CANDIDATE_REGISTRATION);
              }}
              href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
            >
              Je m&apos;inscris <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Highlights />
      <HowToJoin />
      <StepsToJoin />
      <CandidateTestimoniesOrientation style="muted" />
      <Section className="uk-padding-remove-top" style="muted">
        <h4 className="uk-text-center">
          Si vous avez des questions, écrivez-nous à <br />
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>{' '}
          ou appelez nous au{' '}
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            rel="noopener"
            href={`tel:${CONTACT_INFO.MOBILE_PHONE_NUMBER}`}
          >
            {CONTACT_INFO.MOBILE_PHONE_NUMBER}
          </SimpleLink>
        </h4>
      </Section>
    </Layout>
  );
};

export default Travailler;
