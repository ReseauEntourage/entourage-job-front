import Link from 'next/link';
import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { Section, Text, TextSize } from '@/src/components/ui';
import { H1, H2 } from '@/src/components/ui/Headings';

export const DataPrivacy = () => {
  const textAttr = {
    size: 'large' as TextSize,
  };
  return (
    <Layout title="Politique de cookies" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <H1 title="Politique de cookies" center />
        <br />
        <br />
        <H2 title="1. L'utilisation des cookies" />
        <br />
        <Text {...textAttr}>
          Notre site internet Entourage Pro utilise des cookies. Un cookie est
          un petit fichier qui est envoyé avec les pages de ce site Web et qui
          est stocké par votre navigateur sur votre disque dur à partir de votre
          ordinateur, téléphone portable, montre connectée ou tablette. Les
          informations qui y sont stockées peuvent être retournées à nos
          serveurs lors d&apos;une visite ultérieure.
          <br />
          L&apos;utilisation de cookies est d&apos;une grande importance pour le
          bon fonctionnement de notre site web. Grâce à la contribution
          (anonyme) des visiteurs, nous pouvons améliorer l&apos;utilisation du
          site internet et le rendre plus convivial.
        </Text>
        <br />
        <H2 title="2. Consentement" />
        <br />
        <Text {...textAttr}>
          Votre consentement est requis pour l&apos;utilisation de certains
          cookies. Nous le recueillons au moyen d&apos;une bannière informative.
        </Text>
        <br />
        <H2 title="3a. Le type de cookies utilisés et leurs objectifs" />
        <br />
        <Text {...textAttr}>Nous utilisons les cookies suivants :</Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              Cookies fonctionnels : ils nous permettent d&apos;améliorer le
              fonctionnement du site internet et de le rendre plus convivial
              pour le visiteur. Par exemple, nous stockons vos données de
              connexion.
            </li>
            <br />
            <li>
              Cookies de mesure d&apos;audience : ils garantissent qu&apos;un
              cookie anonyme est généré à chaque fois que vous visitez un site
              internet. Ces cookies permettent de savoir si vous avez déjà
              visité le site auparavant ou non. Ce n&apos;est que lors de la
              première visite qu’un cookie est créé. Lors des visites suivantes,
              l&apos;utilisation du cookie déjà existant est automatique. Ce
              cookie n&apos;est utilisé qu&apos;à des fins statistiques. De
              cette façon, les données suivantes peuvent être collectées :
              <br />
              <br />
              <ul>
                <li>le nombre de visiteurs uniques</li>
                <br />
                <li>
                  la fréquence à laquelle les utilisateurs visitent le site
                </li>
                <br />
                <li>quelles pages les visiteurs consultent</li>
                <br />
                <li>
                  combien de temps les utilisateurs consultent une page
                  particulière
                </li>
                <br />
                <li>
                  la page à partir de laquelle les visiteurs quittent le site
                </li>
              </ul>
            </li>
            <br />
            <li>
              Cookies de suivi : ils permettent d&apos;analyser votre
              navigation, vos habitudes de consultation ou de consommation sur
              les sites du réseau, dans le but de vous proposer des publicités
              ciblées ou des services personnalisés. Le profil qui est établi en
              fonction de ces données n&apos;est pas lié à votre nom, adresse,
              adresse mail, etc., mais sert uniquement à faire correspondre les
              publicités à votre profil, afin qu&apos;elles soient aussi
              pertinentes que possible pour vous. Nous recueillons votre
              consentement pour ces cookies. Ils ne seront pas installés sans
              votre consentement.
            </li>
            <br />
            <li>
              Cookies des tiers : ils permettent de suivre les pages que vous
              visitez sur Internet afin de créer votre profil personnel. Ce
              profil n&apos;est pas lié à votre nom, adresse, adresse mail etc.,
              comme indiqué plus haut, mais sert uniquement à vous identifier
              comme un visiteur unique et à adapter les annonces publicitaires à
              votre profil afin qu&apos;elles soient aussi pertinentes que
              possible pour vous. Nous recueillons votre consentement pour ces
              cookies. Ces cookies ne seront pas installés sans votre
              consentement.
            </li>
            <br />
            <li>
              Cookies liés aux réseaux sociaux : ils permettent aux réseaux
              sociaux d&apos;enregistrer les articles et les pages que vous
              partagez via leurs boutons de partage. Ils peuvent également
              contenir des cookies de suivi qui tracent votre comportement de
              navigation sur internet.
            </li>
            <br />
            <li>
              Cookies d&apos;amélioration du site : ils permettent de tester
              différentes versions d&apos;une page internet afin de savoir
              quelle page est mieux utilisée.
            </li>
          </ul>
        </Text>
        <br />
        <H2 title="3b. Liste des cookies utilisés" />
        <br />
        <Text {...textAttr}>
          Cookies Google :
          <br />
          <ul>
            <li>
              Google Analytics : permet de mesurer l&apos;audience du site.
            </li>
            <br />
            <li>
              Google tag manager : facilite l’implémentation des tags sur les
              pages et permet de gérer les balises Google.
            </li>
            <br />
            <li>
              Google Adsense : régie publicitaire de Google utilisant les sites
              web ou les vidéos YouTube comme support pour ses annonces.
            </li>
            <br />
            <li>
              Google Dynamic Remarketing : permet de vous proposer de la
              publicité dynamique en fonction des précédentes recherches.
            </li>
            <br />
            <li>
              Google Adwords Conversion : outil de suivi des campagnes
              publicitaires adwords.
            </li>
            <br />
            <li>
              DoubleClick : cookies publicitaires de Google pour diffuser des
              bannières.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Cookies Facebook :<br />
          <ul>
            <li>
              Facebook social plugins : permet de liker, partager, commenter du
              contenu avec un compte Facebook.
            </li>
            <br />
            <li>
              Facebook Custom Audience : permet d&apos;intérargir avec
              l&apos;audience sur Facebook.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Cookies Twitter :<br />
          <ul>
            <li>
              Twitter button : permet de partager facilement et afficher le
              contenu de Twitter.
            </li>
            <br />
            <li>
              Twitter advertising : permet d&apos;afficher et de cibler des
              publicités par la régie publicitaire de Twitter.
            </li>
          </ul>
        </Text>
        <H2 title="4. Vos droits à l'égard de vos données personnelles" />
        <br />
        <Text {...textAttr}>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, de
          limitation et de suppression de vos données personnelles. En outre,
          vous avez le droit de vous opposer au traitement des données
          personnelles et le droit à la transférabilité de vos données. Vous
          pouvez exercer ces droits en nous envoyant un mail à l&apos;adresse
          suivante&nbsp;
          <Link href="mailto:contact@entourage.social">
            contact@entourage.social
          </Link>
          . Afin de prévenir les abus, nous pouvons vous demander de vous
          identifier sur notre site. Lorsqu&apos;il s&apos;agit d&apos;accéder à
          des données personnelles liées à un cookie, nous vous demandons de
          nous envoyer une copie du cookie en question. Vous pouvez les trouver
          dans les paramètres de votre navigateur.
        </Text>
        <br />
        <H2 title="5. Blocage et suppression des cookies" />
        <br />
        <Text {...textAttr}>
          Vous pouvez facilement bloquer et supprimer vous-même les cookies à
          tout moment par votre navigateur Internet. Vous pouvez également
          configurer votre navigateur Internet de manière à recevoir un message
          lorsqu&apos;un cookie est installé. Vous pouvez également indiquer que
          certains cookies ne peuvent pas être installés. Pour cela, veuillez
          consultez la fonction d&apos;aide de votre navigateur. Si vous
          supprimez les cookies de votre navigateur, cela peut le cas échéant
          avoir des conséquences sur l&apos;utilisation de notre site internet.
        </Text>
        <br />
        <Text {...textAttr}>
          Certains cookies de suivi sont installés par des tiers qui vous
          affichent des publicités via notre site Web. Vous pouvez supprimer ces
          cookies de manière centralisée via&nbsp;
          <Link href="www.youronlinechoices.eu">www.youronlinechoices.eu</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Veuillez noter que si vous ne voulez pas de cookies, nous ne serons
          plus en mesure de garantir le bon fonctionnement de notre site Web.
          Certaines caractéristiques du site peuvent être altérées et dans
          certains cas, vous ne pourrez plus accéder au site. De plus, le refus
          des cookies ne signifie pas que vous ne verrez aucune publicité. Les
          annonces ne sont plus adaptées à vos centres d&apos;intérêt et peuvent
          donc apparaître plus souvent.
        </Text>
        <br />
        <Text {...textAttr}>
          Les étapes à suivre pour ajuster vos paramètres varient d&apos;un
          navigateur à un autre. Si nécessaire, consultez la fonction
          d&apos;aide de votre navigateur, ou rendez-vous sur l’un des liens
          ci-dessous pour accéder directement au manuel de votre navigateur.
          <br />
          <br />
          Firefox :<br />
          <Link href="https://support.mozilla.org/fr/kb/effacer-les-cookies-pour-supprimer-les-information">
            https://support.mozilla.org/fr/kb/effacer-les-cookies-pour-supprimer-les-information
          </Link>
          <br />
          <br />
          Google Chrome :<br />
          <Link href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform=Desktop&hl=fr">
            https://support.google.com/chrome/answer/95647?co=GENIE.Platform=Desktop&hl=fr
          </Link>
          <br />
          <br />
          Internet Explorer :<br />
          <Link href="https://support.microsoft.com/fr-fr/help/278835/how-to-delete-cookie-files-in-internet-explorer">
            https://support.microsoft.com/fr-fr/help/278835/how-to-delete-cookie-files-in-internet-explorer
          </Link>
          <br />
          <br />
          Safari :<br />
          <Link href="https://support.apple.com/kb/ph21411?locale=fr_FR">
            https://support.apple.com/kb/ph21411?locale=fr_FR
          </Link>
        </Text>
        <br />
        <H2 title="6. Nouveaux développements et cookies non prévus" />
        <br />
        <Text {...textAttr}>
          Sur certaines de nos pages, nous pouvons utiliser du contenu qui est
          hébergé sur d&apos;autres sites et qui est rendu accessible sur notre
          site internet au moyen de certains codes (contenu intégré). Ces codes
          utilisent souvent des cookies. Nous n’avons cependant aucun contrôle
          sur ce que ces tiers font de leurs cookies.
          <br />
          <br />
          Il est également possible que, par l&apos;intermédiaire de notre site
          internet, des cookies soient placés par d&apos;autres personnes. Vous
          avez trouvé sur notre site internet des cookies que nous n&apos;avons
          pas identifiés ? Veuillez nous le faire savoir par mail. Vous pouvez
          également contacter directement le tiers et lui demander quels cookies
          il place, quelle en est la raison, quelle est la durée de vie du
          cookie et quelles sont les mesures pour protéger votre vie privée.
        </Text>
        <br />
        <H2 title="7. Remarques" />
        <br />
        <Text {...textAttr}>
          Nous devrons mettre à jour cette politique d&apos;utilisation des
          cookies régulièrement par exemple lorsque nous modifions notre site
          Web ou les règles le concernant. Nous vous prions de consulter cette
          page pour prendre connaissance de la dernière version de notre
          politique d&apos;utilisation des cookies.
          <br />
          <br />
          Si vous avez des questions et/ou des commentaires, veuillez nous
          contacter à l&apos;adresse e-mail suivante :&nbsp;
          <Link href="contact@entourage.social">contact@entourage.social</Link>.
        </Text>
      </Section>
    </Layout>
  );
};

export default DataPrivacy;
