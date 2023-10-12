import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formCandidateContact } from 'src/components/forms/schemas/formCandidateContact';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

export const CandidateContactModal = () => {
  return (
    <ModalEdit
      submitText="J'envoie ma pré-inscription !"
      title="J'inscris un·e candidat·e au programme LinkedOut"
      description={
        <>
          Vous accompagnez une personne en situation de précarité ou
          d&apos;exclusion à la recherche d&apos;un emploi qui souhaite
          rejoindre LinkedOut&nbsp;?
          <br />
          Merci pour votre démarche !
          <br />
          <br />
          Avant de remplir ce formulaire, vérifiez que le candidat&nbsp;:
          <ul className="uk-text-left">
            <li>
              Réside sur les territoires suivants : 75, 93, 92, 56, 59 ou 69
            </li>
            <li>
              Est disponible pour commencer un travail dans moins de 3 mois, et
              pour dédier du temps à sa recherche d&apos;emploi (2h/semaine au
              moins)
            </li>
            <li>
              A levé les freins principaux à la recherche d&apos;emploi ou
              bénéficie d&apos;un accompagnement social soutenu
            </li>
            <li>
              Est prêt à adhérer aux propositions du dispositif pendant les 6
              mois du parcours : mise en avant du CV sur les réseaux, rencontres
              hebdomadaires avec le Coach LinkedOut, rencontres mensuelles en
              collectif, etc.
            </li>
            <li>
              Maîtrise les bases du français (capacité à mener un entretien
              d’embauche)
            </li>
          </ul>
        </>
      }
      formSchema={formCandidateContact}
      onSubmit={async ({ helpWith, businessLines, ...fields }, closeModal) => {
        try {
          await Api.postContactCandidate({
            ...fields,
            helpWith: helpWith.map(({ value }) => value),
            businessLines: businessLines.map(({ value }) => value),
          });
          gaEvent(GA_TAGS.PAGE_ORIENTER_ENVOYER_INSCRIPTION_CLIC);
          fbEvent(FB_TAGS.SOCIAL_WORKER_REGISTRATION_SEND);
          closeModal();
          UIkit.notification(
            "Merci d'avoir répondu à ce formulaire !\nNous revenons le plus rapidement possible vers vous pour convenir d'un échange.",
            'success'
          );
        } catch (error) {
          console.error(error);
          UIkit.notification(
            "Une erreur s'est produite lors de l'envoie du formulaire",
            'danger'
          );
        }
      }}
    />
  );
};