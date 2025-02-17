import Link from 'next/link';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { Section, Text, TextSize } from 'src/components/utils';
import { H1, H2 } from 'src/components/utils/Headings';

export const LegalNotice = () => {
  const textAttr = {
    size: 'large' as TextSize,
  };
  return (
    <Layout title="Mentions légales" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <H1 title="Mentions légales" center />
        <br />
        <br />
        <Text {...textAttr}>
          <ul>
            <li>Nom du site / service Internet : entourage-pro.fr</li>
            <br />
            <li>Editeur du site : Association Entourage</li>
            <br />
            <li>Siège social : 10-12 rue Maurice Grimaud, 75018 Paris</li>
            <br />
            <li>Immatriculation : 813792405</li>
            <br />
            <li>Mail : contact@entourage.social</li>
            <br />
            <li>Directeur de publication du site : Jean-Marc Potdevin</li>
            <br />
            <li>Hébergeur : Heroku Inc</li>
            <br />
            <li>
              Adresse de l’hébergeur : 321 11th St, San Francisco, CA, 94103,
              United States.
              <br />
              <Link href="http://www.heroku.com">http://www.heroku.com</Link>
              <br />
              feedback@heroku.com.
              <br />
              tel : +1 (877) 563-4311
            </li>
          </ul>
        </Text>
        <br />

        <Text {...textAttr}>
          Entourage Pro (auparavant dénommé “LinkedOut”) est un projet porté par
          l’association Entourage, qui permet l’accompagnement des personnes les
          plus précaires ou en situation d’exclusion pour un retour à l’emploi.
        </Text>
        <br />
        <br />

        <H2 title="Déclaration CNIL" />
        <br />
        <Text {...textAttr}>
          Conformément à l’article 32 de la loi n°78-17 du 6 janvier 1978
          modifiée relative à l’informatique, aux fichiers et aux libertés, les
          informations transmises par le biais des formulaires présents sur le
          site sont nécessaires pour répondre à la demande de l’utilisateur et
          sont destinées à Entourage, en tant que responsable du traitement à
          des fins de gestion administrative.
          <br />
          En tant qu’utilisateur du site Internet, vous disposez d’un droit
          d’accès, d’interrogation, modification ou de suppression des données
          personnelles le concernant.
          <br />
          L’utilisateur dispose également d’un droit d’opposition au traitement
          de ses données pour des motifs légitimes ainsi qu’un droit
          d’opposition à ce que ces données soient utilisées à des fins de
          prospection commerciale.
          <br />
          <br />
          <br />
          Le site entourage-pro.fr est régi par le droit français ; les
          visiteurs ayant accès au site de l’étranger doivent s’assurer du
          respect des lois localement applicables. Les mentions légales pouvant
          être modifiées à tout moment et sans préavis, nous vous engageons à
          les consulter régulièrement.
        </Text>
      </Section>
    </Layout>
  );
};

export default LegalNotice;
