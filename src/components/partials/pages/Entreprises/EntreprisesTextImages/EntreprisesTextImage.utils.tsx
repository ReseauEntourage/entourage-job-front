import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { PostPublicOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { Button, Typography } from 'src/components/utils';
import { BulletListElement, List } from 'src/components/utils/Lists';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

export const content = {
  pourquoi: {
    title: 'Pourquoi recruter avec Entourage Pro ?',
    img: '/static/img/company_why.jpg',
    reverse: true,
    content: (
      <>
        <List animated>
          <BulletListElement>
            <Typography weight="bold">
              Répondre à vos besoins en recrutement
            </Typography>
            <Typography>
              Vous identifiez et rencontrez de nouveaux profils, sur tous types
              de métiers
            </Typography>
          </BulletListElement>
          <BulletListElement>
            <Typography weight="bold">
              Agir concrètement en faveur de l’inclusion
            </Typography>
            <Typography>
              Il existe plusieurs façons pour une entreprise de s’engager en
              faveur de l’inclusion. Nous pensons que le recrutement est
              l&apos;expérience la plus impactante pour votre entreprise en vous
              faisant vivre une rencontre unique, et en vous offrant la
              possibilité de renouveler votre approche du recrutement et de
              l&apos;intégration.
            </Typography>
          </BulletListElement>
          <BulletListElement>
            <Typography weight="bold">
              Engager vos collaborateurs dans une démarche d’inclusion
            </Typography>
            <Typography>
              Vous embarquez dans un projet collectif tout en renforçant votre
              marque employeur
            </Typography>
          </BulletListElement>
          <BulletListElement>
            <Typography weight="bold">
              Soutenir la transformation de votre entreprise
            </Typography>
            <Typography>
              En donnant sa chance à une personne qui en a besoin et en créant
              les conditions pour l&apos;accueillir, c&apos;est vous-même qui
              allez vivre une transformation, enrichir votre collectif et votre
              projet d’entreprise&nbsp;!
            </Typography>
          </BulletListElement>
        </List>
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
      </>
    ),
  },
  quoi: {
    title: 'Le recrutement inclusif, c’est quoi ?',
    img: '/static/img/company_what.jpg',
    reverse: false,
    content: (
      <>
        <p>
          Recruter inclusif, c’est donner la chance à une personne en dehors des
          canaux traditionnels d’intégrer votre entreprise et créer les
          conditions pour l’intégrer durablement.
          <br />
          <br />
          Concrètement, vous adaptez votre processus de recrutement et
          l’intégration de la personne. Entourage Pro vous guide et vous
          accompagne pour faire de ce recrutement un succès.
        </p>
        <Button
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_PROPOSER_OFFRE_CLIC);
            fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_OPEN);
            openModal(<PostPublicOpportunityModal />);
          }}
          dataTestId="button-company-second-section"
          style="custom-secondary-inverted"
        >
          Créer une offre
        </Button>
      </>
    ),
  },
  qui: {
    title: 'Qui sont nos candidat(e)s ?',
    img: '/static/img/entreprises-nos-candidats.jpg',
    reverse: true,
    content: (
      <>
        <Typography>
          L’équipe Entourage Pro s&apos;appuie sur des partenaires locaux et des
          associations pour identifier et sélectionner des personnes absentes de
          vos canaux habituels. Les candidats Entourage Pro ont des profils très
          variés en termes de parcours, d&apos;âge, d&apos;expérience, mais ont
          tous en commun&nbsp;:
        </Typography>
        <List>
          <BulletListElement>
            <Typography>
              L&apos;absence de réseau et le fait d&apos;avoir vécu la précarité
              et/ou l&apos;exclusion
            </Typography>
          </BulletListElement>
          <BulletListElement>
            <Typography>
              Une grande motivation pour trouver un emploi stable et construire
              un avenir
            </Typography>
          </BulletListElement>
          <BulletListElement>
            <Typography>
              La capacité à travailler&nbsp;: les freins à l’emploi ont été
              levés
            </Typography>
          </BulletListElement>
        </List>
        <Button
          href={{ pathname: '/candidats', query: { employed: false } }}
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_DECOUVRIR_CANDIDATS_CLICK);
          }}
        >
          Découvrir nos candidat(e)s
        </Button>
      </>
    ),
  },
} as const;
