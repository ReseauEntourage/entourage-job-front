import React from 'react';
import Section from 'src/components/utils/Section';
import Img from 'src/components/utils/Img';
import { Button, Grid } from 'src/components/utils';

import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { addPrefix } from 'src/utils';
import { openModal } from 'src/components/modals/Modal';
import { fbEvent } from 'src/lib/fb';
import ModalGeneric from 'src/components/modals/ModalGeneric';

export const openContactModal = () => {
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

const WhatItBringsToCompanies = () => {
  const content = (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
      <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold uk-text-center uk-margin-bottom uk-margin-remove-top">
          Une nouvelle promotion arrive&nbsp;!
        </h2>
        <h3
          className="uk-text-center uk-margin-remove-top"
          style={{ color: 'white' }}
        >
          Plus de 160 candidats s&apos;apprêtent à se lancer dans la recherche
          d&apos;une nouvelle expérience professionnelle&nbsp;!
          <br />
          Laissez-nous votre contact pour être tenus informés.
        </h3>
      </div>
      <Grid middle column gap="collapse">
        <Button style="secondary" onClick={openContactModal}>
          Nous contacter
        </Button>
      </Grid>
    </div>
  );

  return (
    <Section id="whatItBrings" style="default">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Ce que LinkedOut <span className="uk-text-primary">vous apporte</span>
        </h2>
        <ul
          uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
          className="uk-list uk-list-disc"
        >
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Une sélection de candidats{' '}
              <span className="uk-text-bold">coachés, prêts et motivés</span>{' '}
              pour travailler
            </h4>
          </li>
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Le coach du candidat qui joue le{' '}
              <span className="uk-text-bold">rôle de facilitateur</span> pendant
              tout le process de recrutement
            </h4>
          </li>
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Un{' '}
              <span className="uk-text-bold">
                accompagnement de l’équipe LinkedOut
              </span>{' '}
              à toutes les étapes du recrutement et de l’intégration
            </h4>
          </li>
        </ul>
      </div>
      <div className="uk-margin-medium-top">
        <div className="uk-inline uk-visible@m">
          <Img
            width="1500"
            height="1000"
            src="/static/img/candidats.jpg"
            alt="Visages LinkedOut"
          />
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            className="uk-position-cover"
          />
          <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
            {content}
          </div>
        </div>
        <div
          className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
          style={{
            backgroundImage: `url(${addPrefix('/static/img/candidats.jpg')})`,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          {content}
        </div>
      </div>
    </Section>
  );
};

WhatItBringsToCompanies.propTypes = {};

WhatItBringsToCompanies.defaultProps = {};

export default WhatItBringsToCompanies;
