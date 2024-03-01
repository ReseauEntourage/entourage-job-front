import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  StyledDocumentCenteredText,
  StyledDocumentTitleText,
} from '../Documents.styles';
import { isReadDocument } from '../Documents.utils';
import { SignDocument } from '../SignDocument';
import { Section } from 'src/components/utils';
import { H1, H4, H5 } from 'src/components/utils/Headings';
import { DocumentNames } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import {
  currentUserActions,
  selectCurrentUser,
} from 'src/use-cases/current-user';

const textContent = [
  {
    title: 'Poser votre cadre :',
    list: [
      'Rester dans le périmètres de votre mission',
      'Respecter et accepter vos limites et difficultés',
      'Identifier vos compétences et forces',
      "Rester dans la rencontre et le partage plutôt que l'aide",
    ],
  },
  {
    title:
      'Contribuer à changer le monde, et comprendre qu’on ne sauve pas des vies :',
    description:
      "Pour contribuer à changer le monde à son échelle, sans se cramer, il est nécessaire de respecter un périmètre d'action. Chez Entourage Pro, il est délimité par plusieurs choses :",
    list: [
      'Vos limites personnelles, qui doivent être respectées : disponibilité, horaire de contact, type et nombre de coups de pouce …',
      "Vos compétences métiers, qui ne doivent pas se substituer ou se superposer au travail social et d'insertion.",
      "La mission d'Entourage Pro, qui a pour objectif d'être un tremplin vers l'emploi par le réseau et le soutien, mais n'a pas pour finalité de retrouver un emploi.",
    ],
  },
  {
    title: 'Tenir compte des limites et difficultés de l’autre :',
    description:
      'Pour construire votre posture, il vous faudra aussi être à l’écoute activement de votre interlocuteur en le questionnant pour mieux le comprendre et sans interprétation et jugement. Je n’impose donc pas mon aide.',
  },
  {
    title: 'Créer un lien de confiance :',
    description:
      'La confiance réciproque se construit avec le temps, cela demande de la patience. Ne pas accorder une confiance aveugle à quelqu’un qu’on ne connaît pas.',
  },
  {
    title: 'Créer un lien en toute horizontalité :',
    list: [
      'Considérer la personne sous le prisme de ses forces et non de ses manques ou de ses vulnérabilités',
      'Se positionner en tant que pair, qui a autant à recevoir quà partager, plutôt qu\'en tant que "sachant"',
      "Se positionner en tant que booster, plutôt qu'en tant qu'\"aidant\" ce qui permet de sortir d'un rapport de force aidant/aidé",
    ],
  },
  {
    title: 'Se laisser rencontrer :',
    description:
      'C’est rester suffisamment ouvert et authentique pour se laisser transformer par la relation. Cela ne veut pas dire raconter toute sa vie privée. Créer un lien solide prend du temps et demande de la patience, de la confiance et de l’horizontalité.',
  },
  {
    title: 'Derniers conseils :',
    list: [
      'Prenez des nouvelles des candidats avec qui vous échangez pour maintenir et renforcer le lien.',
      'Les candidats ont souvent peur de déranger. Rassurez-les et clarifiez vos disponibilités !',
    ],
  },
];

export const ConseilsPosture = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(currentUserActions.readDocumentReset());
    };
  }, [dispatch]);
  const user = useSelector(selectCurrentUser);
  return (
    <Section style="custom-primary">
      <H1
        title="Les conseils sur la posture à adopter"
        color={COLORS.primaryOrange}
        center
      />
      <StyledDocumentCenteredText>
        Entourage Pro est donc une plateforme qui a pour objectif de favoriser
        les rencontres et les opportunités professionnelles et donc d’être un
        tremplin professionnel pour les plus exclus.Pour qu’un candidat soit
        bien entouré, il faut plusieurs ingrédients. Le premier consiste à avoir
        différentes ressources pour lui redonner son pouvoir d’agir. Ces
        personnes peuvent être des professionnels, des citoyens, des bénévoles
        qui lui permettront de remettre la main sur les outils et les moyens
        nécessaires pour avancer, et particulièrement dans son projet
        professionnel.
      </StyledDocumentCenteredText>
      <H5
        title="Pour vous accompagner dans votre mission, voici quelques clés de posture essentielles :"
        color="black"
      />
      {textContent.map((item) => {
        const key = uuid();
        return (
          <StyledDocumentTitleText key={key}>
            <H4
              title={item.title}
              color={COLORS.primaryOrange}
              weight="normal"
            />
            {item.description && <p>{item.description}</p>}
            {item.list && (
              <ul>
                {item.list.map((listItem, k) => (
                  <li key={`${uuid()} ${k}`}>{listItem}</li>
                ))}
              </ul>
            )}
          </StyledDocumentTitleText>
        );
      })}
      <H5
        title="Vos référents Entourage Pro sont présents pour vous guider tout au long de votre implication, au rythme de vos coups de pouce."
        color="black"
      />
      {user &&
        !isReadDocument(user.readDocuments, DocumentNames.ConseilsPosture) && (
          <SignDocument
            documentName={DocumentNames.ConseilsPosture}
            label="j’ai lu et compris les principes clés de posture et d’éthique. Je m’engage à les respecter."
          />
        )}
    </Section>
  );
};
