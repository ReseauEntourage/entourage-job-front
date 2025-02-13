import React from 'react';
import { SimpleVideoText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const Decouvrir = () => {
  return (
    <SimpleVideoText
      title="Le travail est un facteur clé d'intégration et de réinsertion."
      videoId="o6oFVuQsjwY"
      videoTitle="reveal Entourage Pro"
    >
      <Text>
        Le problème, c&lsquo;est que ce sont les personnes qui auraient le plus
        besoin d&lsquo;un retour à l&lsquo;emploi qui en sont le plus éloignées.
      </Text>

      <Text>
        En effet, les personnes exclues se heurtent à un frein majeur :
        l’absence de réseau.
      </Text>
      <Text>
        Entourage Pro vise à lever ce frein en donnant un réseau professionnel à
        ceux et celles qui n’en ont pas !
      </Text>
      <Text>
        Notre objectif ? Booster le retour à l&lsquo;emploi des plus exclus
        grâce à l&lsquo;expertise de coachs bénévoles et la force de la
        rencontre.
      </Text>
      <Button
        style="custom-secondary-inverted"
        href="/travailler"
        onClick={() => {
          gaEvent(GA_TAGS.HOME_DECOUVRIR_CTA_CLICK);
        }}
      >
        Découvrir
      </Button>
    </SimpleVideoText>
  );
};
