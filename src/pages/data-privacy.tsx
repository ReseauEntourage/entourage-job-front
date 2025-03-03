import Link from 'next/link';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { Section, Text, TextSize } from 'src/components/utils';
import { H1, H2 } from 'src/components/utils/Headings';

export const DataPrivacy = () => {
  const textAttr = {
    size: 'large' as TextSize,
  };
  return (
    <Layout title="Politique de confidentialité" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <H1 title="Politique de confidentialité Entourage Pro" center />
        <br />
        <br />
        <Text {...textAttr}>
          L&apos;association Entourage, soucieuse des droits des individus,
          notamment au regard des traitements automatisés et dans une volonté de
          transparence avec ses clients, a mis en place une politique reprenant
          l’ensemble de ces traitements, des finalités poursuivies par ces
          derniers ainsi que des moyens d’actions à la disposition des individus
          afin qu’ils puissent au mieux exercer leurs droits. Pour toute
          information complémentaire sur la protection des données personnelles,
          nous vous invitons à consulter le site :&nbsp;
          <Link href="https://www.cnil.fr/">https://www.cnil.fr/</Link>
        </Text>
        <br />
        <Text {...textAttr}>
          La poursuite de la navigation sur ce site vaut acceptation sans
          réserve des dispositions et conditions d&apos;utilisation qui suivent.
          La version actuellement en ligne de ces conditions d&apos;utilisation
          est la seule opposable pendant toute la durée d&apos;utilisation du
          site et jusqu&apos;à ce qu&apos;une nouvelle version la remplace. La
          présente Politique de Confidentialité fait partie des Conditions
          Générales d’Utilisation Entourage Pro.
        </Text>
        <br />
        <H2 title="Article 1 - Délégué à la Protection des données" />
        <br />
        <Text variant="underline" {...textAttr}>
          1.1 Site (ci-après « le site ») :
        </Text>
        <br />
        <Text {...textAttr}>Entourage Pro</Text>
        <br />
        <Text variant="underline" {...textAttr}>
          1.2 Éditeur (ci-après « l&apos;éditeur ») :
        </Text>
        <br />
        <Text {...textAttr}>
          L&apos;association Entourage, déclarée auprès de la préfecture de
          Paris sous le numéro W751227025
          <br />
          dont le siège social est situé : 10-12 rue Maurice Grimaud 75018 Paris
          <br />
          adresse mail :&nbsp;
          <Link href="mailto:contact@entourage.social">
            contact@entourage.social
          </Link>
          <br />
          représentée par Jean-Marc Potdevin, Président
        </Text>
        <br />
        <H2 title="Article 2 - Accès au site" />
        <br />
        <Text {...textAttr}>
          L&apos;accès au site et son utilisation sont réservés à un usage
          strictement personnel. Vous vous engagez à ne pas utiliser ce site et
          les informations ou données qui y figurent à des fins commerciales,
          politiques, publicitaires et pour toute forme de sollicitation
          commerciale et notamment l&apos;envoi de courriers électroniques non
          sollicités.
        </Text>
        <br />
        <H2 title="Article 3 - Contenu du site" />
        <br />
        <Text {...textAttr}>
          Toutes les marques, photographies, textes, commentaires,
          illustrations, images animées ou non, séquences vidéo, sons, ainsi que
          toutes les applications informatiques qui pourraient être utilisées
          pour faire fonctionner ce site et plus généralement tous les éléments
          reproduits ou utilisés sur le site sont protégés par les lois en
          vigueur au titre de la propriété intellectuelle.
        </Text>
        <br />
        <Text {...textAttr}>
          Ils sont la propriété pleine et entière de l&apos;éditeur ou de ses
          partenaires. Toute reproduction, représentation, utilisation ou
          adaptation, sous quelque forme que ce soit, de tout ou partie de ces
          éléments, y compris les applications informatiques, sans l&apos;accord
          préalable et écrit de l&apos;éditeur, sont strictement interdites. Le
          fait pour l&apos;éditeur de ne pas engager de procédure dès la prise
          de connaissance de ces utilisations non autorisées ne vaut pas
          acceptation desdites utilisations et renonciation aux poursuites.
        </Text>
        <br />
        <H2 title="Article 4 - Gestion du site" />
        <br />
        <Text {...textAttr}>
          Pour la bonne gestion du site, l&apos;éditeur pourra à tout moment :
        </Text>
        <Text {...textAttr}>
          <ul>
            <li>
              suspendre, interrompre ou limiter l&apos;accès à tout ou partie du
              site, réserver l&apos;accès au site, ou à certaines parties du
              site, à une catégorie déterminée d&apos;internautes ;
            </li>
            <br />
            <li>
              supprimer toute information pouvant en perturber le fonctionnement
              ou entrant en contravention avec les lois nationales ou
              internationales ;
            </li>
            <br />
            <li>suspendre le site afin de procéder à des mises à jour.</li>
          </ul>
        </Text>
        <br />
        <H2 title="Article 5 - Responsabilités" />
        <br />
        <Text {...textAttr}>
          La responsabilité de l&apos;éditeur ne peut être engagée en cas de
          défaillance, panne, difficulté ou interruption de fonctionnement,
          empêchant l&apos;accès au site ou à une de ses fonctionnalités.
        </Text>
        <br />
        <Text {...textAttr}>
          Le matériel de connexion au site que vous utilisez est sous votre
          entière responsabilité. Vous devez prendre toutes les mesures
          appropriées pour protéger votre matériel et vos propres données
          notamment d&apos;attaques virales par Internet. Vous êtes par ailleurs
          seul responsable des sites et données que vous consultez.
        </Text>
        <br />
        <Text {...textAttr}>
          L&apos;éditeur ne pourra être tenu responsable en cas de poursuites
          judiciaires à votre encontre :
        </Text>
        <Text {...textAttr}>
          <ul>
            <li>
              du fait de l&apos;usage du site ou de tout service accessible via
              Internet ;
            </li>
            <br />
            <li>
              du fait du non-respect par vous des présentes conditions
              générales.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          L&apos;éditeur n&apos;est pas responsable des dommages causés à
          vous-même, à des tiers et/ou à votre équipement du fait de votre
          connexion ou de votre utilisation du site et vous renoncez à toute
          action contre lui de ce fait.
        </Text>
        <Text {...textAttr}>
          Si l&apos;éditeur venait à faire l&apos;objet d&apos;une procédure
          amiable ou judiciaire en raison de votre utilisation du site, il
          pourra se retourner contre vous pour obtenir l&apos;indemnisation de
          tous les préjudices, sommes, condamnations et frais qui pourraient
          découler de cette procédure.
        </Text>
        <br />
        <H2 title="Article 6 - Liens hypertextes" />
        <br />
        <Text {...textAttr}>
          La mise en place par les utilisateurs de tous liens hypertextes vers
          tout ou partie du site est autorisée par l&apos;éditeur. Tout lien
          devra être retiré sur simple demande de l&apos;éditeur.
        </Text>
        <br />
        <Text {...textAttr}>
          Toute information accessible via un lien vers d&apos;autres sites
          n&apos;est pas publiée par l&apos;éditeur. L&apos;éditeur ne dispose
          d&apos;aucun droit sur le contenu présent dans ledit lien.
        </Text>
        <br />
        <H2 title="Article 7 - Collecte et protection des données" />
        <br />
        <Text {...textAttr}>
          Vos données sont collectées par l&apos;association Entourage.
        </Text>
        <br />
        <Text {...textAttr}>
          Une donnée à caractère personnel désigne toute information concernant
          une personne physique identifiée ou identifiable (personne concernée)
          ; est réputée identifiable une personne qui peut être identifiée,
          directement ou indirectement, notamment par référence à un nom, un
          numéro d&apos;identification ou à un ou plusieurs éléments
          spécifiques, propres à son identité physique, physiologique,
          génétique, psychique, économique, culturelle ou sociale.
        </Text>
        <br />
        <Text {...textAttr}>
          Les informations personnelles pouvant être recueillies sur le site
          sont principalement utilisées par l&apos;éditeur pour la gestion des
          relations avec vous, et le cas échéant pour le traitement de vos
          commandes.
        </Text>
        <br />
        <Text {...textAttr}>
          Les données personnelles collectées sont les suivantes :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              pour les visiteurs qui souhaitent s’inscrire aux newsletters
              Entourage Pro, adresse mail, et optionnellement région et profil
              recruteur/candidat/particulier
            </li>
            <br />
            <li>
              pour les recruteurs intéressés de contacter les candidats :
              <ul>
                <li>email</li>
                <li>nom et prénom</li>
                <li>adresse du poste proposé</li>
                <li>informations relatives au poste proposé</li>
              </ul>
            </li>
            <br />
            <li>
              pour les candidats et coaches
              <ul>
                <li>nom et prénom</li>
                <li>code postal</li>
                <li>mail</li>
                <li>numéro de téléphone</li>
                <li>informations sur le parcours professionnel</li>
              </ul>
            </li>
            <br />
            <li>
              pour les candidats
              <ul>
                <li>
                  informations relatives à l’autorisation de travailler en
                  France
                </li>
              </ul>
            </li>
            <br />
            <li>
              pour les personnes physiques et morales souhaitant nous soutenir
              par le don
              <ul>
                <li>nom et prénom</li>
                <li>adresse</li>
                <li>mail</li>
                <li>
                  données financières : dans le cadre du paiement des produits
                  et prestations proposés sur la Plateforme, celle-ci enregistre
                  des données financières relatives à la carte de crédit de
                  l&apos;utilisateur.
                </li>
              </ul>
            </li>
          </ul>
          <br />
          <Text {...textAttr}>
            Un délégué à la protection des données : Vaïté Leprince-Ringuet,
            &nbsp;
            <Link href="dpo@entourage.social">dpo@entourage.social</Link>, est à
            votre disposition pour toute question relative à la protection de
            vos données personnelles.
          </Text>
        </Text>
        <br />
        <H2 title="Article 8 - Droit d’accès, de rectification et de déréférencement de vos données" />
        <br />
        <Text {...textAttr}>
          En application de la réglementation applicable aux données à caractère
          personnel, les utilisateurs disposent des droits suivants :
          <br />
          <ul>
            <li>
              le droit d’accès : ils peuvent exercer leur droit d&apos;accès,
              pour connaître les données personnelles les concernant, en
              écrivant à l&apos;adresse électronique ci-dessous mentionnée. Dans
              ce cas, avant la mise en œuvre de ce droit, la Plateforme peut
              demander une preuve de l&apos;identité de l&apos;utilisateur afin
              d&apos;en vérifier l&apos;exactitude ;
            </li>
            <br />
            <li>
              le droit de rectification : si les données à caractère personnel
              détenues par la Plateforme sont inexactes, ils peuvent demander la
              mise à jour des informations ;
            </li>
            <br />
            <li>
              le droit de suppression des données : les utilisateurs peuvent
              demander la suppression de leurs données à caractère personnel,
              conformément aux lois applicables en matière de protection des
              données ;
            </li>
            <br />
            <li>
              le droit à la limitation du traitement : les utilisateurs peuvent
              de demander à la Plateforme de limiter le traitement des données
              personnelles conformément aux hypothèses prévues par le RGPD ;
            </li>
            <br />
            <li>
              le droit de s’opposer au traitement des données : les utilisateurs
              peuvent s’opposer à ce que leurs données soient traitées
              conformément aux hypothèses prévues par le RGPD ;
            </li>
            <br />
            <li>
              le droit à la portabilité : ils peuvent réclamer que la Plateforme
              leur remette les données personnelles qu&apos;ils ont fournies
              pour les transmettre à une nouvelle Plateforme.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Vous pouvez exercer ce droit en nous contactant, à l’adresse suivante
          : Association Entourage, 10-12 rue Maurice Grimaud, 75018 Paris ; ou
          par email, à l’adresse&nbsp;
          <Link href="mailto:dpo@entourage.social">dpo@entourage.social</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Vous pouvez aussi vous adresser à notre délégué à la protection des
          données : Vaïté Leprince-Ringuet,&nbsp;
          <Link href="mailto:dpo@entourage.social">dpo@entourage.social</Link>,
          qui est à votre disposition pour toute question relative à la
          protection de vos données personnelles.
        </Text>
        <br />
        <Text {...textAttr}>
          Toute demande doit être accompagnée de la photocopie d’un titre
          d’identité en cours de validité signé et faire mention de l’adresse à
          laquelle l&apos;éditeur pourra contacter le demandeur. La réponse sera
          adressée dans le mois suivant la réception de la demande. Ce délai
          d&apos;un mois peut être prolongé de deux mois si la complexité de la
          demande et/ou le nombre de demandes l&apos;exigent.
        </Text>
        <br />
        <Text {...textAttr}>
          De plus, et depuis la loi n°2016-1321 du 7 octobre 2016, les personnes
          qui le souhaitent, ont la possibilité d’organiser le sort de leurs
          données après leur décès. Pour plus d’information sur le sujet, vous
          pouvez consulter le site Internet de la CNIL :&nbsp;
          <Link href="https://www.cnil.fr/">https://www.cnil.fr/</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Les utilisateurs peuvent aussi introduire une réclamation auprès de la
          CNIL sur le site de la CNIL :&nbsp;
          <Link href="https://www.cnil.fr">https://www.cnil.fr</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Nous vous recommandons de nous contacter dans un premier temps avant
          de déposer une réclamation auprès de la CNIL, car nous sommes à votre
          entière disposition pour régler votre problème.
        </Text>
        <br />
        <H2 title="Article 9 - Utilisation des données" />
        <br />
        <Text {...textAttr}>
          Les données personnelles collectées auprès des utilisateurs ont pour
          objectif la mise à disposition des services de la Plateforme, leur
          amélioration et le maintien d&apos;un environnement sécurisé. La base
          légale des traitements est l’exécution du contrat entre l’utilisateur
          et la Plateforme. Plus précisément, les utilisations sont les
          suivantes :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              accès et utilisation de la Plateforme par l&apos;utilisateur ;
            </li>
            <br />

            <li>
              gestion du fonctionnement et optimisation de la Plateforme ;
            </li>
            <br />
            <li>mise en œuvre d&apos;une assistance utilisateurs ;</li>
            <br />
            <li>
              vérification, identification et authentification des données
              transmises par l&apos;utilisateur ;
            </li>
            <br />
            <li>
              personnalisation des services en affichant des publicités en
              fonction de l&apos;historique de navigation de l&apos;utilisateur,
              selon ses préférences ;
            </li>
            <br />
            <li>
              prévention et détection des fraudes, malwares (malicious softwares
              ou logiciels malveillants) et gestion des incidents de sécurité ;
            </li>
            <br />
            <li>gestion des éventuels litiges avec les utilisateurs ;</li>
            <br />
            <li>
              envoi d&apos;informations commerciales et publicitaires, en
              fonction des préférences de l&apos;utilisateur ;
            </li>
            <br />
            <li>
              organisation des conditions d&apos;utilisation des Services de
              paiement.
            </li>
          </ul>
        </Text>
        <br />
        <H2 title="Article 10 - Politique de conservation des données" />
        <br />
        <Text {...textAttr}>
          La Plateforme conserve vos données pour la durée nécessaire pour vous
          fournir ses services ou son assistance.
          <br />
          Dans la mesure raisonnablement nécessaire ou requise pour satisfaire
          aux obligations légales ou réglementaires, régler des litiges,
          empêcher les fraudes et abus ou appliquer nos modalités et conditions,
          nous pouvons également conserver certaines de vos informations si
          nécessaire, même après que vous ayez fermé votre compte ou que nous
          n&apos;ayons plus besoin pour vous fournir nos services.
        </Text>
        <br />
        <H2 title="Article 11 - Partage des données personnelles avec des tiers" />
        <br />
        <Text {...textAttr}>
          Les données personnelles peuvent être partagées avec des sociétés
          tierces exclusivement dans l’Union européenne, dans les cas suivants :
          <br />
          <ul>
            <li>
              quand l&apos;utilisateur utilise les services de paiement, pour la
              mise en œuvre de ces services, la Plateforme est en relation avec
              des sociétés bancaires et financières tierces avec lesquelles elle
              a passé des contrats ;
            </li>
            <br />
            <li>
              lorsque l&apos;utilisateur publie, dans les zones de commentaires
              libres de la Plateforme, des informations accessibles au public ;
            </li>
            <br />
            <li>
              quand l&apos;utilisateur autorise le site web d&apos;un tiers à
              accéder à ses données ;
            </li>
            <br />
            <li>
              quand la Plateforme recourt aux services de prestataires pour
              fournir l&apos;assistance utilisateurs, la publicité et les
              services de paiement. Ces prestataires disposent d&apos;un accès
              limité aux données de l&apos;utilisateur, dans le cadre de
              l&apos;exécution de ces prestations, et ont l&apos;obligation
              contractuelle de les utiliser en conformité avec les dispositions
              de la réglementation applicable en matière protection des données
              à caractère personnel ;
            </li>
            <br />
            <li>
              si la loi l&apos;exige, la Plateforme peut effectuer la
              transmission de données pour donner suite aux réclamations
              présentées contre la Plateforme et se conformer aux procédures
              administratives et judiciaires.
            </li>
          </ul>
        </Text>
        <br />
        <H2 title="Article 12 - Offres commerciales" />
        <br />
        <Text {...textAttr}>
          Vous êtes susceptible de recevoir des offres commerciales de
          l&nbsp;éditeur. Si vous ne le souhaitez pas, veuillez cliquer sur le
          lien suivant : &nbsp;
          <Link href="mailto:dpo@entourage.social">dpo@entourage.social</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Vos données sont susceptibles d’être utilisées par les partenaires de
          l&nbsp;éditeur à des fins de prospection commerciale, si vous ne le
          souhaitez pas, veuillez cliquer sur le lien suivant :&nbsp;
          <Link href="mailto:dpo@entourage.social">dpo@entourage.social</Link>.
        </Text>
        <br />
        <Text {...textAttr}>
          Si, lors de la consultation du site, vous accédez à des données à
          caractère personnel, vous devez vous abstenir de toute collecte, de
          toute utilisation non autorisée et de tout acte pouvant constituer une
          atteinte à la vie privée ou à la réputation des personnes.
          L&nbsp;éditeur décline toute responsabilité à cet égard.
        </Text>
        <br />
        <Text {...textAttr}>
          Les données sont conservées et utilisées pour une durée conforme à la
          législation en vigueur.
        </Text>
        <br />
        <H2 title="Article 13 - Cookies" />
        <br />
        <Text {...textAttr}>
          Qu’est-ce qu’un « cookie » ?<br />
          Un « Cookie » ou traceur est un fichier électronique déposé sur un
          terminal (ordinateur, tablette, smartphone,…) et lu par exemple lors
          de la consultation d&apos;un site internet, de la lecture d&apos;un
          courrier électronique, de l&apos;installation ou de l&apos;utilisation
          d&apos;un logiciel ou d&apos;une application mobile et ce, quel que
          soit le type de terminal utilisé (source :&nbsp;
          <Link href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi">
            https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi
          </Link>
          ). Le site peut collecter automatiquement des informations standards.
          Toutes les informations collectées indirectement ne seront utilisées
          que pour suivre le volume, le type et la configuration du trafic
          utilisant ce site, pour en développer la conception et
          l&apos;agencement et à d&apos;autres fins administratives et de
          planification et plus généralement pour améliorer le service que nous
          vous offrons.
        </Text>
        <br />
        <Text {...textAttr}>
          Le cas échéant, des « cookies » émanant de l&apos;éditeur du site
          et/ou des sociétés tiers pourront être déposés sur votre terminal,
          avec votre accord. Dans ce cas, lors de la première navigation sur ce
          site, une bannière explicative sur l’utilisation des « cookies »
          apparaîtra. Avant de poursuivre la navigation, le client et/ou le
          prospect devra accepter ou refuser l’utilisation desdits « cookies ».
          Le consentement donné sera valable pour une période de treize (13)
          mois. L&apos;utilisateur a la possibilité de désactiver les cookies à
          tout moment.
        </Text>
        <br />
        <Text {...textAttr}>
          Les cookies suivants sont présents sur ce site :
        </Text>
        <br />
        <Text weight="bold" {...textAttr}>
          Cookies Google :
        </Text>
        <Text {...textAttr}>
          <ul>
            <li>
              Google Analytics : permet de mesurer l&apos;audience du site ;
            </li>
            <li>
              Google tag manager : facilite l’implémentation des tags sur les
              pages et permet de gérer les balises Google ;
            </li>
            <li>
              Google Adsense : régie publicitaire de Google utilisant les sites
              web ou les vidéos YouTube comme support pour ses annonces ;
            </li>
            <li>
              Google Adwords Conversion : outil de suivi des campagnes
              publicitaires adwords ;
            </li>
            <li>
              DoubleClick : cookies publicitaires de Google pour diffuser des
              bannières.
            </li>
          </ul>
        </Text>
        <br />
        <Text weight="bold" {...textAttr}>
          Cookies Facebook :
        </Text>
        <Text {...textAttr}>
          <ul>
            <li>
              Facebook social plugins : permet de liker, partager, commenter du
              contenu avec un compte Facebook ;
            </li>
            <li>
              Facebook Custom Audience : permet d&apos;intérargir avec
              l&apos;audience sur Facebook.
            </li>
          </ul>
        </Text>
        <br />
        <Text weight="bold" {...textAttr}>
          Cookies LinkedIn :
        </Text>
        <Text {...textAttr}>
          <ul>
            <li>
              LinkedIn Insight Tag : sert à proposer à des audiences similaires
              sur LinkedIn de découvrir Entourage Pro.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          La durée de vie de ces cookies est de treize mois.
        </Text>
        <br />
        <Text {...textAttr}>
          Pour le détail du traitement des Cookies se référer à notre&nbsp;
          <Link href="/cookies">Politique de Cookies</Link>.
        </Text>
        <br />
        <H2 title="Article 14 - Photographies et représentation des produits" />
        <br />
        <Text {...textAttr}>
          Les photographies de produits, accompagnant leur description, ne sont
          pas contractuelles et n&apos;engagent pas l&apos;éditeur.
        </Text>
        <br />
        <H2 title="Article 15 - Loi applicable" />
        <br />
        <Text {...textAttr}>
          Les présentes conditions d&apos;utilisation du site sont régies par la
          loi française et soumises à la compétence des tribunaux du siège
          social de l&apos;éditeur, sous réserve d&apos;une attribution de
          compétence spécifique découlant d&apos;un texte de loi ou
          réglementaire particulier.
        </Text>
        <br />
        <H2 title="Article 16 - Contactez-nous" />
        <br />
        <Text {...textAttr}>
          Pour toute question, information sur les produits présentés sur le
          site, ou concernant le site lui-même, vous pouvez laisser un message à
          l&apos;adresse suivante :&nbsp;
          <Link href="mailto:contact@entourage.social">
            contact@entourage.social
          </Link>
          .
        </Text>
      </Section>
    </Layout>
  );
};

export default DataPrivacy;
