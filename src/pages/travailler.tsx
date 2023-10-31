import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import UIkit from 'uikit';
import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { formCandidateInscription } from 'src/components/forms/schemas/formCandidateInscription';
import { openModal } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { StyledModalContent } from 'src/components/modals/Modal/Modals.styles';
import {
  NewsletterPartial,
  SharePartial,
  CandidateTestimoniesOrientation,
} from 'src/components/partials';
import { ImageTitle } from 'src/components/partials/ImageTitleNew';
import { Partners } from 'src/components/partials/PartnersNew';
import { Participer } from 'src/components/partials/Travailler/Participer';
import { Rejoindre } from 'src/components/partials/Travailler/Rejoindre';
import { Steps } from 'src/components/partials/Travailler/Steps';
import { Section } from 'src/components/utils';
import { ANTENNE_INFO } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

const Travailler = () => {
  const openModalInscription = (gTagLabel: string) => {
    gaEvent({
      ...GA_TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC,
      label: gTagLabel,
    });
    fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_OPEN);
    openModal(
      <ModalEdit
        title="Rejoindre LinkedOut"
        description="Pour mieux vous connaitre, nous avons besoins de quelques informations ! Merci de répondre à ces quelques questions, cela prend moins de 5 min !"
        formSchema={formCandidateInscription}
        submitText="Valider"
        onSubmit={async (fields, closeModal) => {
          gaEvent({
            ...GA_TAGS.PAGE_TRAVAILLER_ENVOYER_DEPOSER_CANDIDATURE_CLIC,
            label: gTagLabel,
          });

          fbEvent(FB_TAGS.CANDIDATE_REGISTRATION_SEND);

          try {
            await Api.postInscriptionCandidate(fields);

            closeModal();

            const { data: campaigns } = await Api.getCampaigns();

            const selectedCampaign = campaigns.find((campaign) => {
              return campaign.id === fields.infoCo;
            });

            const antenne = ANTENNE_INFO.find((info) => {
              return info.dpt === fields.location;
            });

            const infoCoAddress = selectedCampaign?.address
              ? _.upperFirst(selectedCampaign?.address)
              : _.upperFirst(antenne?.address);

            const email = antenne?.mailCoordo;

            const infoCoDate = _.upperFirst(
              `${moment(
                campaigns.find((campaign) => {
                  return campaign.id === fields.infoCo;
                })?.time
              ).format('dddd D MMMM [à] HH[h]mm')}`
            );

            openModal(
              <ModalGeneric
                title="Merci pour votre inscription !"
                onClose={closeModal}
                withCloseButton
              >
                <StyledModalContent>
                  {fields.infoCo ? (
                    <>
                      <p>
                        Nous sommes impatient de vous retrouver pour la réunion
                        d&apos;information collective, qui aura lieu dans nos
                        locaux le&nbsp;:
                      </p>
                      <p>
                        <strong>{infoCoDate}</strong>
                      </p>
                      <p>
                        <strong>{infoCoAddress}</strong>
                      </p>
                      <p>
                        N’oubliez pas de noter la date dans votre agenda, cette
                        réunion est indispensable pour commencer le programme
                        LinkedOut.
                      </p>
                      <p>
                        Si vous avez un empêchement, n’oubliez pas de nous
                        prévenir par mail&nbsp;: {email}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Nous allons vous contacter rapidement pour vous proposer
                        un rendez-vous.
                      </p>
                      <p>
                        Si vous avez des questions, n’hésitez pas à nous
                        contacter par mail&nbsp;: {email}
                      </p>
                    </>
                  )}
                </StyledModalContent>
              </ModalGeneric>
            );
          } catch (err) {
            console.error(err);
            UIkit.notification('Un problème est survenu', 'danger');
          }
        }}
      />
    );
  };

  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        title="LinkedOut, un tremplin vers l’emploi"
        description={`Vous êtes dans une situation de précarité ou d’exclusion\xa0? Vous avez un projet professionnel mais vous n’avez pas de réseau\xa0?`}
        img="/static/img/travailler-banner.jpg"
        imgMobile="/static/img/travailler-banner.jpg"
        alt="Candidats LinkedOut en recherche d’emploi"
        cta={{
          label: 'Rejoindre LinkedOut',
          onClick: () => {
            openModalInscription('Header');
          },
          className: 'custom-secondary-inverted',
          dataTest: 'banner-cta',
        }}
      />
      <Participer cta={openModalInscription} />
      <Rejoindre cta={openModalInscription} />
      <Steps cta={openModalInscription} />
      <CandidateTestimoniesOrientation noTitle noVideo style="muted" />
      <Partners />
      <Section style="custom-primary">
        <NewsletterPartial
          padding={false}
          tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC}
        />
      </Section>
      <Section style="custom-primary">
        <SharePartial />
      </Section>
    </Layout>
  );
};

export default Travailler;
