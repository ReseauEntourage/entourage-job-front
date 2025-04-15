import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { Button, Text } from 'src/components/utils';
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
        <List>
          <BulletListElement>
            <Text weight="bold">Répondre à vos besoins en recrutement</Text>
            <Text>
              Vous identifiez et rencontrez de nouveaux profils, sur tous types
              de métiers
            </Text>
          </BulletListElement>
          <BulletListElement>
            <Text weight="bold">
              Agir concrètement en faveur de l’inclusion
            </Text>
            <Text>
              Il existe plusieurs façons pour une entreprise de s’engager en
              faveur de l’inclusion. Nous pensons que le recrutement est
              l&apos;expérience la plus impactante pour votre entreprise en vous
              faisant vivre une rencontre unique, et en vous offrant la
              possibilité de renouveler votre approche du recrutement et de
              l&apos;intégration.
            </Text>
          </BulletListElement>
          <BulletListElement>
            <Text weight="bold">
              Engager vos collaborateurs dans une démarche d’inclusion
            </Text>
            <Text>
              Vous embarquez dans un projet collectif tout en renforçant votre
              marque employeur
            </Text>
          </BulletListElement>
          <BulletListElement>
            <Text weight="bold">
              Soutenir la transformation de votre entreprise
            </Text>
            <Text>
              En donnant sa chance à une personne qui en a besoin et en créant
              les conditions pour l&apos;accueillir, c&apos;est vous-même qui
              allez vivre une transformation, enrichir votre collectif et votre
              projet d’entreprise&nbsp;!
            </Text>
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
      </>
    ),
  },
  qui: {
    title: 'Qui sont nos candidat(e)s ?',
    img: '/static/img/entreprises-nos-candidats.jpg',
    reverse: true,
    content: (
      <>
        <Text>
          L’équipe Entourage Pro s&apos;appuie sur des partenaires locaux et des
          associations pour identifier et sélectionner des personnes absentes de
          vos canaux habituels. Les candidats Entourage Pro ont des profils très
          variés en termes de parcours, d&apos;âge, d&apos;expérience, mais ont
          tous en commun&nbsp;:
        </Text>
        <List>
          <BulletListElement>
            <Text>
              L&apos;absence de réseau et le fait d&apos;avoir vécu la précarité
              et/ou l&apos;exclusion
            </Text>
          </BulletListElement>
          <BulletListElement>
            <Text>
              Une grande motivation pour trouver un emploi stable et construire
              un avenir
            </Text>
          </BulletListElement>
          <BulletListElement>
            <Text>
              La capacité à travailler&nbsp;: les freins à l’emploi ont été
              levés
            </Text>
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
