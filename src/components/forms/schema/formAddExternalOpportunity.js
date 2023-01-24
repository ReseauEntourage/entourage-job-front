import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';

export const formAddExternalOpportunityCandidate = {
  id: 'form-offer-external',
  fields: [
    {
      id: 'generalInformation',
      title: 'Informations générales',
      component: 'heading',
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste *',
    },
    {
      component: 'fieldgroup',
      fields: [
        {
          id: 'company',
          name: 'company',
          component: 'text-input',
          title: "Nom de l'entreprise*",
        },
        {
          id: 'department',
          name: 'department',
          title: 'Localisation *',
          placeholder: 'Localisation',
          openMenuOnClick: false,
          component: 'select-request-async-new',
          options: DEPARTMENTS_FILTERS,
          loadOptions: (inputValue, callback) => {
            callback([]);
          },
        },
      ],
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-new',
      options: CONTRACTS,
      title: 'Type de contrat*',
    },
    {
      id: 'recruiterInformation',
      title: 'Coordonnées du recruteur',
      component: 'heading',
    },
    {
      component: 'fieldgroup',
      fields: [
        {
          id: 'recruiterFirstName',
          name: 'recruiterFirstName',
          component: 'text-input',
          title: 'Prénom du recruteur',
        },
        {
          id: 'recruiterName',
          name: 'recruiterName',
          component: 'text-input',
          title: 'Nom du recruteur',
        },
      ],
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'text-input',
      type: 'email',
      title: 'Adresse mail du recruteur',
    },
    {
      id: 'offerDetails',
      title: "Détails de l'offre",
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea-new',
      title:
        'Ecrire ou copier le detail de l’offre pour faciliter le suivi de votre candidature',
    },
    {
      id: 'otherInfo',
      name: 'otherInfo',
      component: 'textarea-new',
      title: 'Informations complémentaires',
    },
    {
      id: 'link',
      name: 'link',
      component: 'text-input',
      title: "Lien de l'offre",
    },
    // PJ
    {
      id: 'coachNotification',
      name: 'coachNotification',
      component: 'checkbox-new',
      title:
        'Voulez- vous envoyer un mail à votre coach pour l’avertir que vous avez ajouter une nouvelle offre',
    },
  ],
  rules: [
    {
      field: 'title',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'company',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'department',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'contract',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
  ],
};
