import React from 'react';
import { H1, H2 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { BulletListElement, List } from '../Lists';
import { Text, TextProps } from '../Text';
import {
  EthicsCharterContainer,
  EthicsCharterItem,
} from './EthicsCharter.styles';
import { EthicsCharterVariant } from './EthicsCharter.types';

type EthicsCharterItemType = {
  title: string;
  content: string | string[];
  list?: string[];
  afterList?: string | string[];
};

const LAST_UPDATED_AT = 'Mise à jour le 7 septembre 2026';

const renderRichText = (text: string) => {
  return text.split('\n').map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((segment, segmentIndex) => {
        const boldMatch = /^\*\*([^*]+)\*\*$/.exec(segment);
        if (boldMatch) {
          return <strong key={segmentIndex}>{boldMatch[1]}</strong>;
        }

        return <React.Fragment key={segmentIndex}>{segment}</React.Fragment>;
      })}
    </React.Fragment>
  ));
};

const items: EthicsCharterItemType[] = [
  {
    title: 'Charte éthique',
    content: [
      "Entourage Pro, c'est un **réseau professionnel solidaire** qui permet à chacun de **développer ses opportunités et de créer des liens nécessaires pour avancer dans son parcours**.\nGrâce à ce réseau, nous favorisons les rencontres, l'entraide et l'accès à des opportunités professionnelles, en particulier pour les personnes qui en sont le plus éloignées.",
      "Nous mettons à votre disposition des espaces d'échange (comme les groupes WhatsApp) pensés pour être simples, bienveillants et utiles à toutes et tous.",
      'Nous avons à cœur de faire vivre un réseau sûr, respectueux et inclusif. Pour cela, nous vous invitons à adhérer aux principes ci-dessous, afin que chacun puisse évoluer dans un cadre de confiance et de soutien.',
      "Notre équipe **assure chaque jour la modération de la plateforme** afin de vous offrir un environnement de confiance, fidèle à l'esprit d'Entourage. Si vous observez un comportement ou un contenu qui ne correspond pas à nos valeurs, n'hésitez pas à **utiliser la fonctionnalité \"Signaler un problème\"** : nous sommes là pour vous écouter et intervenir si besoin.",
      'À noter : la modération est assurée au sein de la plateforme. En revanche, les échanges qui ont lieu en dehors de celle-ci relèvent de la responsabilité des personnes concernées.',
    ],
  },
  {
    title: 'Discussions et échanges',
    content: [
      "Tout au long de votre aventure sur la plateforme Entourage Pro, vous serez amenés à échanger avec d'autres membres de la communauté. Pour que chacun se sente à l'aise, respecté et en sécurité, il est essentiel de communiquer dans un cadre bienveillant et respectueux.",
      'Chez Entourage, chaque message, chaque rencontre et chaque mot comptent - faisons-en des occasions de créer du lien positif.',
    ],
  },
  {
    title: 'Propos discriminatoires et violents',
    content: [
      "La bienveillance et le respect sont au cœur de chaque échange. **Tout comportement discriminatoire, violent ou contraire à la loi est strictement interdit**. Toute personne adoptant un tel comportement pourrait voir son compte supprimé et s'exposer à des poursuites judiciaires conformément au cadre légal en vigueur.",
      "**Les comportements violents ou irrespectueux envers les équipes de l'association entraîneront également un blocage temporaire ou définitif du compte**.",
      'Notre priorité est de préserver un espace sûr et respectueux pour toutes et tous.',
    ],
  },
  {
    title: 'Comportements déviants',
    content: [
      "Pour préserver la sécurité de toutes et tous, certains comportements n'ont pas leur place au sein de notre communauté.",
      'Ainsi, sont strictement interdits :',
    ],
    list: [
      'Les comportements assimilables à **de la drague ou à du harcèlement**, sous quelque forme que ce soit',
      "**Les invitations à quitter l'application** pour d'autres réseaux **dans des contextes ambigus ou non sécurisés**",
      '**Les propos ou allusions à caractère sexuel,** notamment en lien avec des violences ou agressions',
      "**Toute apologie d'actes illégaux** : trafic de drogue ou d'armes, proxénétisme, vandalisme, corruption, incitation à la haine ou à la violence, usurpation d'identité, marché noir, etc.",
      "**Les publications à visée commerciale ou promotionnelle** ne relèvent pas de l'esprit d'entraide d'Entourage",
      'Toute forme de **discours sectaire, prosélyte ou manipulateur** cherchant à influencer ou à recruter des membres',
    ],
    afterList: [
      "Ces comportements sont incompatibles avec les valeurs d'Entourage et pourront entraîner la suppression du contenu concerné, la désactivation du compte et, le cas échéant, un signalement aux autorités compétentes.",
      "Chez Entourage, nous voulons que chacun puisse créer du lien d'amitié en toute confiance. Si vous êtes témoin ou victime d'un comportement inapproprié, n'hésitez pas à utiliser la fonctionnalité \"Signaler un problème\" - notre équipe est là pour vous écouter, vous protéger et agir.",
    ],
  },
  {
    title: 'Entraide',
    content: [
      "Sur Entourage Pro, chaque rencontre repose sur le respect, l'écoute et l'égalité. Vous choisissez de considérer votre interlocuteur à travers ses qualités, ses talents et son potentiel, en adoptant une posture d'ouverture et sans jugement. Les échanges se font d'égal à égal, dans un esprit de confiance mutuelle, où aucune forme de dévalorisation n'a sa place.",
      "Dans ce cadre, vous veillez à vous exprimer avec courtoisie, bienveillance et sincérité. L'honnêteté, la clarté et le respect guident vos interactions, afin de créer un environnement propice à des relations authentiques et constructives.",
      "Entourage Pro est un espace dédié à l'entraide et au partage. Vous pouvez y solliciter ou proposer des conseils professionnels, tels que l'aide à la rédaction d'un CV ou la préparation d'un entretien, et aussi offrir du soutien, des encouragements ou des mises en relation avec votre réseau, qu'il soit professionnel ou personnel. Ces échanges peuvent également prendre la forme de moments de rencontre et de discussion, favorisant des liens simples et humains.",
      "Lorsque vous vous engagez dans une relation d'entraide, vous vous efforcez d'être disponible et attentif, en répondant dans des délais raisonnables. Cet engagement contribue à instaurer une dynamique de confiance et de réciprocité, essentielle au bon fonctionnement de la communauté.",
    ],
  },
  {
    title: 'Consentement',
    content: [
      "Lorsque vous publiez une demande au nom d'une autre personne, assurez-vous toujours d'avoir obtenu son accord au préalable. **Le respect du consentement est essentiel** : chacun doit pouvoir choisir ce qui est partagé à son sujet. De la même manière, attention à **ne pas diffuser d'informations personnelles** (comme un numéro de téléphone, une adresse ou des détails sur la situation d'une personne) **permettant d'identifier et de localiser précisément une personne, ni aucune donnée sensible** (médicale, judiciaire…) sans son accord explicite. Chez Entourage, la solidarité se construit dans le respect et la confiance.",
      "Et si vous avez besoin d'un accompagnement ou d'une orientation personnalisée, n'hésitez pas à nous écrire à votre référent Entourage Pro, notre équipe se fera un plaisir de vous écouter et de comprendre votre besoin.",
    ],
  },
  {
    title: 'Posture des coachs et des candidats',
    content: [
      "Chez Entourage Pro, avant d'être coach ou candidat, il y a d'abord le lien qui se crée entre deux personnes avec simplicité, sourire et convivialité. C'est cette dimension humaine qui donne tout son sens au soutien apporté : bien plus qu'un suivi vers l'emploi, c'est l'occasion de créer du lien, de partager un moment, de prendre soin de l'autre.",
      "Cet accompagnement n'a d'ailleurs rien d'un coaching professionnel classique : pas de contrat, pas d'obligation de résultat, pas de posture de client à satisfaire. C'est pourquoi nous parlons de candidats et non de clients : parce qu'ici, c'est la relation humaine et conviviale qui prime sur la performance.",
      "Être coach chez Entourage, c'est choisir de donner de son temps, de son écoute et de sa bonne humeur, sans jugement, en s'adaptant au rythme de l'autre. Partager un café, prendre des nouvelles, échanger sur autre chose que la recherche d'emploi : ces moments simples comptent tout autant que les conseils professionnels. Il n'y a pas de méthode à imposer ni de case à cocher : il y a une présence chaleureuse, une disponibilité sincère, l'envie de faire un bout de chemin ensemble.",
      "Pour le candidat, c'est un espace où il peut se sentir accueilli, écouté et soutenu, dans un climat de confiance, et avancer à son rythme, sans avoir à performer ou à se justifier.",
      "Une relation de confiance se construit à deux, et l'engagement du coach appelle en miroir celui du candidat. Répondre aux messages, même brièvement ; prévenir en cas d'absence, de retard ou d'empêchement ; partager les freins ou les difficultés rencontrées plutôt que de laisser le silence s'installer : ce sont ces petites attentions qui permettent à la relation de vivre pleinement. S'engager dans l'échange, c'est aussi respecter le temps et l'investissement du coach, qui donne bénévolement de son énergie pour accompagner chaque candidat.",
      "Ce lien qui se tisse entre coach et candidat, fait de patience, de bienveillance et de convivialité, est au cœur de ce qui rend Entourage Pro unique : une communauté vivante, où l'on avance ensemble, dans le respect mutuel, porté par l'entraide et le plaisir de se rencontrer plutôt que par la seule recherche de résultats. Si un besoin d'accompagnement plus spécifique se fait sentir, le référent Entourage Pro reste toujours disponible pour prendre le relais.",
    ],
  },
  {
    title: 'Événements',
    content: [
      'Entourage organise des évènements que vous pouvez rejoindre (en ligne ou en présentiel).',
      "Ces événements doivent respecter le cadre d'Entourage, à savoir la rencontre solidaire, basée autour d'une remobilisation vers l'emploi.",
      "Chaque événement s'inscrit dans des principes de cohésion et de bienveillance. L'écoute, le respect du partage et l'absence de jugement constituent des valeurs fondamentales au cœur des activités menées par Entourage Pro. Le non-respect de ces principes peut conduire à l'exclusion de ces temps et à la suppression du compte par l'équipe de modérateurs de la plateforme.",
    ],
  },
  {
    title: 'Profiter de la rencontre',
    content: [
      "Chaque échange sur Entourage Pro est une occasion de créer du lien et de vivre une expérience humaine enrichissante. Vous veillez à faire de vos interactions des moments de partage, d'ouverture et de convivialité, où chacun peut se sentir accueilli et à l'aise.",
      'Dans cet esprit, vous contribuez à instaurer une atmosphère chaleureuse et positive, en abordant chaque rencontre avec simplicité et bonne humeur. Ces instants, même courts, participent à construire une communauté vivante, bienveillante et profondément humaine.',
    ],
  },
];

export const EthicsCharter = ({
  variant = 'compact',
}: {
  variant?: EthicsCharterVariant;
}) => {
  const isPage = variant === 'page';
  const titleProps = {
    weight: 'normal',
    size: 'xxlarge',
    color: 'primaryBlue',
  } as TextProps;

  const [intro, ...sections] = items;

  const renderParagraphs = (content: string | string[]) => {
    const paragraphs = Array.isArray(content) ? content : [content];
    return paragraphs.map((paragraph) =>
      isPage ? (
        <p key={paragraph}>{renderRichText(paragraph)}</p>
      ) : (
        <Text key={paragraph} textAlign="justify">
          {renderRichText(paragraph)}
        </Text>
      )
    );
  };

  const renderList = (list?: string[]) => {
    if (!list) {
      return null;
    }
    return (
      <List>
        {list.map((listItem) => (
          <BulletListElement key={listItem}>
            {isPage ? (
              <p>{renderRichText(listItem)}</p>
            ) : (
              <Text textAlign="justify">{renderRichText(listItem)}</Text>
            )}
          </BulletListElement>
        ))}
      </List>
    );
  };

  return (
    <EthicsCharterContainer $variant={variant}>
      {isPage ? (
        <>
          <H1 title={intro.title} color={COLORS.primaryBlue} center />
          <Text size="small" color="darkGray" center>
            {LAST_UPDATED_AT}
          </Text>
          <EthicsCharterItem $variant={variant}>
            {renderParagraphs(intro.content)}
          </EthicsCharterItem>
        </>
      ) : (
        <EthicsCharterItem $variant={variant}>
          {renderParagraphs(intro.content)}
        </EthicsCharterItem>
      )}
      {sections.map((item) => (
        <EthicsCharterItem $variant={variant} key={item.title}>
          {isPage ? (
            <H2 title={item.title} color={COLORS.primaryBlue} />
          ) : (
            <Text {...titleProps}>{item.title}</Text>
          )}
          {renderParagraphs(item.content)}
          {renderList(item.list)}
          {item.afterList && renderParagraphs(item.afterList)}
        </EthicsCharterItem>
      ))}
    </EthicsCharterContainer>
  );
};
