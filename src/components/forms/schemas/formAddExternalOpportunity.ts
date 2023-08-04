import { FormSchema } from '../FormSchema';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';

export const formAddExternalOpportunityCandidate: FormSchema = {
  id: 'form-offer-external',
  fields: [
    {
      id: 'generalInformation',
      name: 'generalInformation',
      title: 'Informations générales',
      component: 'heading',
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste *',
      isRequired: true,
    },
    {
      id: 'companyDepartment',
      name: 'companyDepartment',
      component: 'fieldgroup',
      fields: [
        {
          id: 'company',
          name: 'company',
          component: 'text-input',
          title: "Nom de l'entreprise*",
          isRequired: true,
        },
        {
          id: 'department',
          name: 'department',
          title: 'Localisation *',
          component: 'select-simple',
          options: DEPARTMENTS_FILTERS,
          isRequired: true,
        },
      ],
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      isRequired: true,
    },
    {
      id: 'recruiterInformation',
      name: 'recruiterInformation',
      title: 'Coordonnées du recruteur',
      component: 'heading',
    },
    {
      id: 'recruiterInfo',
      component: 'fieldgroup',
      name: 'fieldgroup',
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
      name: 'offerDetails',
      title: "Détails de l'offre",
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title:
        'Ecrire ou copier le detail de l’offre pour faciliter le suivi de votre candidature',
      isRequired: true,
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
      component: 'checkbox',
      title: "Envoyer un mail à votre coach pour l'informer",
    },
  ],
};
