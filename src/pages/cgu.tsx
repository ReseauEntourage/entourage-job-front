import Link from 'next/link';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { Section, Text, TextSize } from 'src/components/utils';
import { H1, H2, H3 } from 'src/components/utils/Headings';

export const CGU = () => {
  const textAttr = {
    size: 'large' as TextSize,
  };
  return (
    <Layout title="Conditions Générales d'Utilisation" noIndex>
      <Section className="uk-text-center" style="default" size="large">
        <H1 title="Conditions Générales d'Utilisation" center />
        <br />
        <br />
        <H2 title="1. Présentation de l'association Entourage et mentions légales" />
        <br />
        <Text {...textAttr}>
          L&apos;Application Entourage Pro (ci-après « l’Application ») est
          éditée par l’association Entourage, association loi 1901 à but non
          lucratif régie par la loi du 1er juillet 1901, déclarée à la
          préfecture du 75 le 20/11/2014 et dont les extraits ont été publiés au
          Journal officiel du 06/12/2014, dont le siège est situé au 10-12 rue
          Maurice Grimaud 75018 Paris et dont le numéro de SIREN / SIRET / RNA
          est le 813 792 405 00017, représentée par Jean-Marc Potdevin agissant
          en qualité de Président.
        </Text>
        <br />
        <Text {...textAttr}>
          L&apos;Application a pour mission de lutter contre la solitude et
          l&apos;exclusion sociale en créant un réseau de soutien collaboratif.
          L&apos;Application propose des fonctionnalités pour :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              Les « Coachs » (riverains) et les « Candidats » (personnes en
              situation d&apos;exclusion) : mise en relation pour des aides en
              vue de l’insertion professionnelle des Candidats.
            </li>
            <br />
            <li>
              Les Candidats : publication et partage en ligne de CV dédiés.
            </li>
            <br />
            <li>
              Les Coachs et Candidats : accompagnement dans un parcours de
              mentorat « 360 ».
            </li>
            <br />
            <li>
              Les Coachs 360 et Candidats : suivi des processus de recrutement.
            </li>
            <br />
            <li>
              Les Visiteurs : offre de soutien aux Candidats ayant publié leur
              CV.
            </li>
            <br />
            <li>
              Les Entreprises : envoi d&apos;offres d&apos;emploi aux Candidats.
            </li>
            <br />
            <li>Les Associations : suivi des bénéficiaires.</li>
            <br />
            <li>
              Le Directeur de la publication de l’Application est Monsieur
              Jean-Marc Potdevin.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          L’Application est hébergée par la société Heroku Inc. dans un centre
          de données situé en Union Européenne et ainsi soumis aux exigences du
          RGPD. Heroku Inc. est une société dont le siège social se situe 321
          11th St, San Francisco, CA, 94103, United States.
        </Text>
        <br />
        <Text {...textAttr}>
          Il est possible de prendre contact avec Entourage (notamment en cas de
          demandes, réclamations ou de notifications de la part de
          l’Utilisateur) à l’adresse électronique suivante :&nbsp;
          <Link href="mailto:contact@entourage.social">
            &quot;contact@entourage.social&quot;
          </Link>
          .
        </Text>
        <br />
        <H2 title="2. Objet des conditions d'utilisation" />
        <br />
        <Text {...textAttr}>
          Les Conditions d’Utilisation ont pour objet de définir les conditions
          d’accès et d’utilisation de l’Application par les différents types
          d’Utilisateurs :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              les Utilisateurs Coachs et Candidats, dans le cadre de leur
              activité personnelle, ci-après désignés sous le terme
              “Utilisateurs Grand Public”.
            </li>
            <br />
            <li>
              les visiteurs des pages accessibles hors connexion à l’Application
              du site Internet d’Entourage Pro, ci-après désignés sous le terme
              “Utilisateurs Visiteurs”.
            </li>
            <br />
            <li>
              les membres des associations ayant souscrit/conclu un partenariat
              spécifique avec Entourage (associations orientant des Candidats),
              dans le cadre de l’activité menée par l’association, ci-après
              désignés sous le terme “Utilisateurs Associations externes” ;
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Elles ont vocation à s’appliquer et à régir l’usage de l’Application
          par toutes personnes (ci-après « Utilisateurs ») indépendamment de
          leurs qualités, le lieu où elles se trouvent, les modalités de
          connexion, l’objet et la finalité de leur accès à l’Application.
        </Text>
        <br />
        <Text {...textAttr}>
          Dans la suite des CGU ci-dessous, les termes suivants sont utilisés :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              Bénéficiaire d’association partenaire : ce terme désigne les
              personnes en situation d’exclusion bénéficiant d’un accompagnement
              social par les Associations partenaires de l’Application.
            </li>
          </ul>
        </Text>
        <br />
        <H2 title="3. Acceptation des conditions générales d'utilisation par l'utilisateur" />
        <br />
        <Text {...textAttr}>
          L’accès à l’Application vaut acceptation intégrale et sans réserve des
          présentes Conditions d’Utilisation et de la Politique de
          Confidentialité par l’Utilisateur ; et de leurs éventuelles mises à
          jour ultérieures. L’acceptation électronique a la même valeur
          juridique qu’une signature manuscrite.
        </Text>
        <br />
        <Text {...textAttr}>
          Ces Conditions Générales peuvent être modifiées à tout moment par
          Entourage et entrent en vigueur à compter de leur mise en ligne sur
          l’Application. Aussi, tout Utilisateur doit régulièrement consulter
          les Conditions Générales et vérifier l’existence de telles
          modifications. Tout Utilisateur sera réputé avoir accepté la nouvelle
          version des Conditions Générales du simple fait de l’accès à
          l’Application et/ou de la poursuite de l’utilisation des services.
        </Text>
        <br />
        <Text {...textAttr}>
          Les Conditions Générales applicables à l’Utilisateur sont celles qui
          sont en vigueur au jour où celui-ci accède, consulte et/ou utilise
          l’Application.
        </Text>
        <br />
        <Text {...textAttr}>
          Le Client peut à tout moment consulter librement les Conditions
          Générales Entourage Pro sur le&nbsp;
          <Link href="https://www.entourage.social/">site web d’Entourage</Link>
          .
        </Text>
        <br />
        <H2 title="4. Durée" />
        <br />
        <Text {...textAttr}>
          Les présentes Conditions d’Utilisation s’appliquent pendant toute la
          durée d’utilisation de l’Application par l’Utilisateur.
        </Text>
        <br />
        <H2 title="5. Services proposés" />
        <br />
        <Text {...textAttr}>
          Les Services mis à disposition des Utilisateurs via l’Application sont
          les suivants. Les services sont fournis &apos;tels quels&apos; et
          peuvent être modifiés ou interrompus à tout moment, sans préavis.
        </Text>
        <br />
        <H3 title="5.1 - Services disponibles pour les Utilisateurs Candidats" />
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              création et gestion de leur fiche Candidat accessible aux autres
              Utilisateurs connectés à l’Application
            </li>
            <br />
            <li>
              création et gestion de la publication de leur CV sur le site
              Entourage Pro
            </li>
            <br />
            <li>
              envoi de messages aux autres Utilisateurs Coachs et Candidats
            </li>
            <br />
            <li>
              réception d’offres d’emploi personnelles et consultation d’une
              banque d’offres d’emplois
            </li>
            <br />
            <li>candidatures aux offres d’emploi</li>
            <br />
            <li>gestion de leurs processus de recrutement</li>
            <br />
            <li>consultation de contenus pédagogiques</li>
            <br />
            <li>envoi de messages à l’équipe de support Entourage</li>
            <br />
            <li>
              invitations à des évènements ponctuels en ligne ou en présentiel
            </li>
          </ul>
        </Text>
        <H3 title="5.2 - Services disponibles pour les Utilisateurs Coachs non mentors 360" />
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              création et gestion de leur fiche Coach accessible aux autres
              Utilisateurs connectés à l’Application
            </li>
            <br />
            <li>
              envoi de messages aux autres Utilisateurs Coachs et Candidats
            </li>
            <br />
            <li>consultation de contenus pédagogiques</li>
            <br />
            <li>envoi de messages à l’équipe de support Entourage</li>
            <br />
            <li>
              invitations à des évènements ponctuels en ligne ou en présentiel
            </li>
          </ul>
        </Text>
        <br />
        <H3 title="5.3 - Services disponibles pour les Utilisateurs Coachs 360" />
        <br />
        <Text {...textAttr}>
          <ul>
            <li>tous les services disponibles aux Coachs non mentors 360</li>
            <br />
            <li>
              ainsi que l’accès aux fonctionnalités de publication du CV, de
              consultation des offres d’emploi et de gestion des processus de
              recrutement de leur Candidat
            </li>
          </ul>
        </Text>
        <br />
        <H3 title="5.4 - Services disponibles pour les Utilisateurs Visiteurs" />
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              envoi de messages aux Candidats dont le CV est publié sur le site
              Entourage Pro
            </li>
            <br />
            <li>
              transmission d’offres d’emplois à un Candidat individuel ou à
              l’ensemble des Candidats
            </li>
            <br />
            <li>orientation de potentiels Candidats</li>
            <br />
            <li>prise de contact avec Entourage</li>
          </ul>
        </Text>
        <br />
        <H2 title="6. Utilisation des services" />
        <br />
        <H3 title="6.1 - Conditions d’accès aux services pour les Utilisateurs Grand Public" />
        <br />
        <Text {...textAttr}>
          L’Application est mise à disposition des Utilisateurs gratuitement
          depuis son site Internet&nbsp;
          <Link href="https://www.entourage-pro.fr/">www.entourage-pro.fr</Link>
        </Text>
        <br />
        <Text {...textAttr}>
          Pour accéder aux fonctionnalités de l’Application, l’Utilisateur doit
          au préalable remplir sur le site Internet un formulaire d’inscription.
          Il valide la création de son compte en cliquant sur un lien de
          confirmation de son adresse e-mail communiqué via e-mail par Entourage
          et en choisissant un mot de passe sécurisé. Il a ensuite à tout moment
          la possibilité de modifier son adresse e-mail, en se soumettant au
          même processus de vérification, ainsi que de modifier son mot de
          passe.
        </Text>
        <br />
        <Text {...textAttr}>
          L’Utilisateur, en acceptant les présentes Conditions, déclare être
          majeur et utiliser l’Application dans le respect des présentes
          Conditions Générales d’Utilisation.
        </Text>
        <br />
        <Text {...textAttr}>
          La vérification de l’adresse e-mail et la sécurisation du mot de passe
          permettent, d’une part, de s’assurer de l’identité de l’Utilisateur
          et, d’autre part, de présumer que toute opération effectuée après
          composition du mot de passe émane nécessairement d’un Utilisateur
          dûment habilité et autorisé.
        </Text>
        <br />
        <H3 title="6.2 - Gestion des mots de passe" />
        <br />
        <Text {...textAttr}>
          Les mots de passe sont personnels, confidentiels et non
          transmissibles. Afin de respecter la confidentialité des mots de
          passe, il est notamment demandé aux Utilisateurs de ne pas transmettre
          ou communiquer leurs mots de passe et d’avertir sans délai Entourage
          en cas de perte ou de vol de leur mot de passe.
        </Text>
        <br />
        <H3 title="6.3 - Licence d’accès à l’Application Entourage Pro" />
        <br />
        <Text {...textAttr}>
          Entourage accorde une licence limitée à l’accès et à l’utilisation de
          l’Application à l’Utilisateur.
        </Text>
        <br />
        <Text {...textAttr}>
          En aucun cas, l’Utilisateur n’est autorisé à télécharger et/ou à
          modifier et/ou à reproduire tout ou partie de l’Application. La mise
          en place par un Utilisateur d’un lien hypertexte vers une plateforme
          de téléchargement de l’Application est possible mais ne saurait en
          aucun cas engager la responsabilité de Entourage.
        </Text>
        <br />
        <Text>
          En outre, l’Utilisateur s’engage à ne rien faire qui puisse créer une
          quelconque référence à Entourage ou à l’Application et engager la
          responsabilité d’Entourage envers des tiers.
        </Text>
        <br />
        <Text {...textAttr}>
          Toute utilisation de contenus (information, texte, charte graphique,
          rubrique, image, cartes …) et/ou dénomination et/ou de marques et/ou
          de logos ou autres signes distinctifs de Entourage Pro est interdite
          sauf autorisation préalable expresse et écrite de Entourage.
        </Text>
        <br />
        <H3 title="6.4 - Contenus" />
        <br />
        <Text {...textAttr}>
          Certains services et fonctionnalités de l’Application ont pour
          finalité d&apos;offrir aux Utilisateurs des outils de prise de notes.
          Entourage s’interdit d’accéder à ces contenus ou informations créés
          par les Utilisateurs. Entourage ne procède donc à aucune vérification
          de ces contenus et informations.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage peut prendre connaissance des messages privés échangés entre
          Utilisateurs via l’Application exclusivement après signalement
          automatisé ou par un Utilisateur, et uniquement à des fins de
          traitement des abus.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage examine les offres d&apos;emploi soumises à un Candidat
          individuel ou à l&apos;ensemble des Candidats via l&apos;Application
          et procède à leur validation. Seules les offres d&apos;emploi validées
          sont transmises aux Candidats.
        </Text>
        <br />
        <Text {...textAttr}>
          L’Utilisateur demeure seul responsable au titre des contenus et
          informations qu’il collecte ou qu’il rend accessible via
          l’Application. L’Utilisateur s’engage à répondre de tout dommage qui
          en découlerait pour Entourage.
        </Text>
        <br />
        <Text {...textAttr}>
          L’Utilisateur est informé qu&pos;il est strictement interdit de
          collecter et/ou d&apos;utiliser les données à caractère personnel des
          autres Utilisateurs sans leur accord express.
        </Text>
        <br />
        <H3 title="6.5 - Suppression de l’accès à l’Application" />
        <br />
        <Text {...textAttr}>
          Toute utilisation frauduleuse ou abusive des services est strictement
          interdite et pourra entraîner la suspension immédiate de l&apos;accès
          à l&apos;Application, sans préjudice de toute action judiciaire qui
          pourrait être engagée.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage se réserve le droit de supprimer l’accès à l’Application à
          tout Utilisateur qui ne se conforme pas aux présentes Conditions
          d’Utilisation et à la Politique de Confidentialité et/ou qui enfreint
          la loi, notamment en diffusant par le biais de l’Application des
          messages contraires à l’ordre public ou aux bonnes mœurs, à caractère
          frauduleux, violent, raciste, ou faisant l’apologie des crimes de
          guerre, injurieux ou grossiers, contraires aux droits d’auteur ou
          droits voisins, au droit applicable aux bases de données, au droit des
          marques, au droit à l’image, au droit au respect de la vie privée, au
          droit de la concurrence ou qui enfreindraient toute autre disposition
          législative ou réglementaire en vigueur.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage se réserve le droit de révoquer l&apos;accès à
          l&apos;Application pour tout Utilisateur ayant recours à une identité
          falsifiée.
        </Text>
        <br />
        <H2 title="7. Garanties et limitations de responsabilités" />
        <br />
        <Text {...textAttr}>
          Les Utilisateurs assument l&apos;entière responsabilité :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              de l&apos;utilisation qu&apos;ils font de l&apos;Application,
            </li>
            <br />
            <li>
              des informations, contenus et/ou documents qu&apos;ils créent ou
              partagent via l&apos;Application,
            </li>
            <br />
            <li>
              ainsi que des interactions qu&apos;ils initient avec d&apos;autres
              Utilisateurs au sein de l&apos;Application.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage s&apos;engage, afin de protéger les Utilisateurs, à
          supprimer en moins de 48 heures tout contenu public signalé par
          l’Utilisateur, et qu’Entourage juge être contraire à l’ordre public ou
          aux bonnes mœurs, à caractère frauduleux, violent, raciste, ou faisant
          l’apologie des crimes de guerre, injurieux ou grossiers, contraire aux
          droits d’auteur ou droits voisins, au droit applicable aux bases de
          données, au droit des marques, au droit à l’image, au droit au respect
          de la vie privée, au droit de la concurrence ou qui enfreindrait toute
          autre disposition législative ou réglementaire en vigueur.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage exerce un contrôle automatisé, basé sur certains mots clés à
          exclure, des messages transmis via le formulaire de contact des
          Candidats dont le CV est publié, et du premier message d’une
          conversation de la messagerie privée entre Utilisateurs. Ce contrôle
          automatisé vise à protéger les Utilisateurs des risques de fraude. En
          cas de mot-clé interdit détecté, l’envoi du message est
          automatiquement bloqué.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage ne saurait en aucune manière être tenue responsable de
          quelque perte ou dommage que ce soit, direct ou indirect, résultant de
          la non-conformité d’un usage à la réglementation en vigueur,
          d&apos;erreur ou d&apos;omission, de quelque perte ou dommage que ce
          soit, direct ou indirect, consécutif à l&apos;utilisation de
          l’Application par un Utilisateur.
        </Text>
        <br />
        <Text {...textAttr}>
          L&apos;Utilisateur reconnaît expressément qu&apos;il doit faire preuve
          de discernement dans l&apos;utilisation qu&apos;il fait des outils
          offerts par Entourage au travers de son Application.
          L&apos;Utilisateur reconnaît expressément qu’il supporte tous les
          risques y afférents, notamment concernant la licéité, la véracité,
          l&apos;opportunité ou l&pos;utilité des informations et contenus
          qu&apos;il consulte ou publie au travers de l’Application.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage attire particulièrement l’attention des Utilisateurs qu’elle
          appelle à la plus grande diligence concernant notamment :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              la mise à disposition d’information pouvant porter atteinte à la
              vie privée des personnes sans leur consentement ;
            </li>
            <br />
            <li>
              le nécessaire respect des lois applicables en matière de
              traitement de données à caractère personnel et de protection des
              personnes et de leur vie privée.
            </li>
          </ul>
        </Text>
        <br />
        <Text {...textAttr}>
          Par ailleurs, l’Utilisateur reconnaît et accepte que :
        </Text>
        <br />
        <Text {...textAttr}>
          <ul>
            <li>
              Entourage garantit à l&apos;Utilisateur l&apos;existence
              matérielle de l’Application et des services et fonctionnalités y
              afférent dans le cadre d&apos;un usage conforme aux Conditions
              d&apos;Utilisation. Entourage ne fournit à l&apos;Utilisateur
              aucune autre garantie d&apos;aucune sorte, expresse ou implicite ;
            </li>
            <br />
            <li>
              l&apos;utilisation de l’Application se fait aux risques et périls
              de l’Utilisateur notamment en ce qui concerne le téléchargement de
              données, de fichiers ou de logiciels qui pourraient endommager son
              terminal. La responsabilité de Entourage ne peut en particulier
              être engagée pour toute perte de données, virus, bogue
              informatique ou dommage affectant le terminal de l’Utilisateur ;
            </li>
            <br />
            <li>
              Entourage ne garantit pas l&apos;adéquation entre les services et
              fonctionnalités proposés via son Application et les attentes de
              l’Utilisateur ;
            </li>
            <br />
            <li>
              Entourage ne garantit pas la continuité des services et ne peut en
              conséquence être tenue responsable d’une perte ou d&apos;un
              dommage, direct ou indirect, qui pourrait résulter d’une
              interruption ou d’une suspension d&apos;un ou de l’ensemble des
              services et fonctionnalités de l’Application ;
            </li>
            <br />
            <li>
              Entourage ne garantit pas la qualité et/ou la licéité ou la
              conformité à la loi du contenu non créé par Entourage ou diffusés
              sur des sites extérieurs accessibles par le biais d&apos;un lien
              hypertexte à partir de l&apos;Application ;
            </li>
            <br />
            <li>
              Entourage ne saurait être tenue responsable de la violation par
              l’Utilisateur de droits, notamment privatifs, détenus par des
              tiers et portant sur des données diffusées par l’Utilisateur ;
            </li>
            <br />
            <li>
              Entourage ne pourra être tenue responsable de dommages, directs ou
              indirects, tels que pertes financières, manques à gagner, troubles
              de quelque nature que ce soit qui pourraient résulter de
              l’utilisation ou de l’impossibilité d’utilisation l’Application.
            </li>
            <br />
            <li>
              Entourage ne pourra être tenue responsable des dommages, directs
              ou indirects, qui pourraient résulter de l&apos;utilisation non
              autorisée par un tiers des noms et mot de passe de
              l&apos;Utilisateur.
            </li>
          </ul>
        </Text>
        <br />
        <H2 title="8. Maintenance de l'application" />
        <br />
        <Text {...textAttr}>
          Entourage s’engage à assurer la maintenance régulière de l’Application
          et se réserve également la possibilité de recourir à un tiers afin
          d’assurer une partie ou la totalité desdites opérations de
          maintenance. Certaines opérations de maintenance pourront entraîner
          des interruptions momentanées des services et fonctionnalités de
          l’Application.
        </Text>
        <br />
        <H2 title="9. Assistance des utilisateurs" />
        <br />
        <Text {...textAttr}>
          Entourage s’engage à faire ses meilleurs efforts pour apporter aux
          Utilisateurs l&apos;assistance technique nécessaire à la bonne
          utilisation de l’Application et à leur fournir tous conseils et
          informations à ce titre. Cette assistance technique sera réalisée
          exclusivement à distance (
          <Link href="mailto:contact@entourage.social">
            contact@entourage.social
          </Link>
          ).
        </Text>
        <br />
        <Text {...textAttr}>
          Les Utilisateurs pourront contacter Entourage en s’adressant à :
          <Link href="mailto:contact@entourage.social">
            &quot;contact@entourage.social&quot;.
          </Link>
        </Text>
        <br />
        <Text {...textAttr}>
          Les horaires d’ouverture du service sont les suivants : du lundi au
          vendredi de 9h à 18h à l’exclusion des jours fériés.
        </Text>
        <br />
        <H2 title="10. Données personnelles et politique de confidentialité" />
        <br />
        <Text {...textAttr}>
          Concernant la confidentialité des données personnelles des
          Utilisateurs de l’Application, et les droits d&pos;accès, de
          rectification, d’anonymisation et de suppression des données
          personnelles par l’Utilisateur, veuillez consulter la Politique de
          Confidentialité d’Entourage Pro qui fait partie de ces conditions
          générales d’utilisation.
        </Text>
        <br />
        <H2 title="11. Responsabilité" />
        <br />
        <Text {...textAttr}>
          Entourage fera en sorte d’apporter le plus grand soin afin d’apporter
          un service de qualité aux Utilisateurs, néanmoins Entourage ne saurait
          être tenue à une quelconque obligation de résultat au titre des
          services et fonctionnalités disponibles dans l’Application.
        </Text>
        <br />
        <Text {...textAttr}>
          Les informations et contenus échangés entre Utilisateurs grâce à
          l’Application le seront sous la responsabilité exclusive de leur
          auteur sans intervention de Entourage. Les auteurs s’engagent à faire
          leur affaire de leur conformité aux dispositions législative et
          réglementaires en vigueur, sous peine d’encourir la suppression de
          leur accès à l’Application conformément aux stipulations de l’article
          « RADIATION DE L’UTILISATEUR » ci-après.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage s’efforcera de mettre en œuvre tous les moyens nécessaires
          afin de maintenir l’Application accessible aux Utilisateurs. La
          responsabilité de Entourage ne pourra toutefois pas être engagée en
          cas d’impossibilité pour l’Utilisateur d’utiliser tout ou partie des
          services et fonctionnalités de l’Application quelle qu’en soit la
          cause, en particulier lors des périodes au cours desquelles il est
          procédé à la maintenance et/ou à l’amélioration des programmes et/ou
          matériels nécessaires au bon fonctionnement des services proposés ou à
          l’extension de leurs fonctionnalités.
        </Text>
        <br />
        <Text {...textAttr}>
          Entourage n’est pas responsable en cas d’interruption du réseau
          Internet ni en cas d’utilisation abusive ou illicite du code d’accès
          de l’Utilisateur.
        </Text>
        <br />
        <Text {...textAttr}>
          La responsabilité de Entourage ne peut être retenue en cas de
          manquement à ses obligations contractuelles du fait d’un cas fortuit
          ou d’un cas de force majeure tel que défini par la jurisprudence
          française.
        </Text>
        <br />
        <H2 title="12. Droits de propriété intellectuelle" />
        <br />
        <Text {...textAttr}>
          A l’exclusion des informations et contenus créés ou partagés par les
          Utilisateurs, l’ensemble des éléments constituant l’Application, y
          incluant en particulier les programmes informatiques, logiciels, bases
          de données, outils et contenus utilisés (titres, éditoriaux, images,
          organisation, logiciels, signes distinctifs …) sont la propriété
          exclusive de Entourage et/ou des personnes lui ayant consenti une
          licence.
        </Text>
        <br />
        <Text {...textAttr}>
          A l’exclusion des informations et contenus créés ou partagés par les
          Utilisateurs, l’ensemble des éléments constituant l’Application, y
          incluant en particulier les programmes informatiques, logiciels, bases
          de données, outils et contenus utilisés (titres, éditoriaux, images,
          organisation, logiciels, signes distinctifs …) sont la propriété
          exclusive de Entourage et/ou des personnes lui ayant consenti une
          licence.
        </Text>
        <br />
        <H2 title="13. Radiation de l'utilisateur" />
        <br />
        <Text {...textAttr}>
          Entourage se réserve le droit de radier immédiatement un Utilisateur
          inscrit, en cas de non-respect de l’une des Conditions d’Utilisation
          et dispositions de la Charte ou de conditions particulières propres à
          tout ou partie des services et fonctionnalités de l’Application.
        </Text>
        <br />
        <H2 title="14. Conservation et archivage" />
        <br />
        <Text {...textAttr}>
          Entourage s’engage auprès des Utilisateurs à conserver tous documents
          contractuels dans les conditions imposées par la réglementation en
          vigueur.
        </Text>
        <br />
        <Text {...textAttr}>
          Les Utilisateurs pourront obtenir communication de ces archives en
          adressant une lettre recommandée avec accusé de réception à Entourage
          à l’adresse postale suivante : 10-12 rue Maurice Grimaud, 75018 Paris.
        </Text>
        <br />
        <H2 title="15. Permanence" />
        <br />
        <Text {...textAttr}>
          La nullité d’une clause quelconque des Conditions d’Utilisation
          n’affecte pas la validité des autres clauses ; elle se poursuit en
          l’absence du dispositif annulé sauf si la clause annulée rend la
          poursuite des relations contractuelles impossible ou déséquilibrée par
          rapport aux stipulations contractuelles initiales.
        </Text>
        <br />
        <H2 title="16. Loi applicable et juridiction compétente" />
        <br />
        <Text {...textAttr}>
          Les présentes conditions d’utilisation sont soumises à la loi
          française et européenne. A défaut de règlement amiable, toute
          difficulté d’interprétation ou d’exécution sera exclusivement portée
          devant les Tribunaux compétents du ressort de la Cour d’appel de
          Paris.
        </Text>
      </Section>
    </Layout>
  );
};

export default CGU;
