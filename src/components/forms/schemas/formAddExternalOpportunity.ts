import moment from 'moment/moment';
import { isAfter } from 'validator';
import { FormSchema } from '../FormSchema';
import { Api } from 'src/api';
import {
  BUSINESS_LINES,
  BusinessLineValue,
  Contract,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
  ExternalOfferOrigin,
  OFFER_STATUS,
  OfferStatus,
} from 'src/constants';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';
import { findConstantFromValue } from 'src/utils';

export const formAddExternalOpportunityCandidate: FormSchema<{
  title: string;
  company: string;
  department: FilterConstant<Department>;
  contract: Contract;
  recruiterFirstName: string;
  recruiterName: string;
  recruiterMail: string;
  description: string;
  link: string;
  coachNotification: boolean;
}> = {
  id: 'form-add-offer-external',
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
          component: 'select',
          isMulti: false,
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
        'Ecrire ou copier le detail de l’offre pour faciliter le suivi de votre candidature*',
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

export const formAddExternalOpportunityAsAdmin: FormSchema<{
  candidateId: FilterConstant<string>;
  status: OfferStatus;
  title: string;
  company: string;
  contract: Contract;
  startOfContract: string;
  endOfContract: string;
  isPartTime: boolean;
  businessLines: FilterConstant<BusinessLineValue>[];
  recruiterFirstName: string;
  recruiterName: string;
  recruiterMail: string;
  department: FilterConstant<Department>;
  link: string;
  description: string;
  externalOrigin: ExternalOfferOrigin;
}> = {
  id: 'form-add-offer-external',
  fields: [
    {
      id: 'candidateStatus',
      name: 'candidateStatus',
      component: 'fieldgroup',
      fields: [
        {
          id: 'candidateId',
          name: 'candidateId',
          title: 'Renseignez le candidat concerné*',
          component: 'select-async',
          isMulti: false,
          loadOptions: (callback, inputValue) => {
            Api.getUsersSearch({
              params: {
                query: inputValue,
                role: CANDIDATE_USER_ROLES,
              },
            })
              .then(({ data }) => {
                return data.map((u) => {
                  return {
                    value: u.id,
                    label: `${u.firstName} ${u.lastName}`,
                  };
                });
              })
              .then(callback);
          },
          isRequired: true,
        },
        {
          id: 'status',
          name: 'status',
          title: 'Statut',
          component: 'select-simple',
          options: OFFER_STATUS.slice(1),
        },
      ],
    },

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
          component: 'select',
          isMulti: false,
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
      id: 'startEndContract',
      name: 'startEndContract',
      component: 'fieldgroup',
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          disable: (getValue) => {
            const contract = findConstantFromValue(
              getValue('contract'),
              CONTRACTS
            );
            return !contract || !contract.end;
          },
          rules: [
            {
              method: (fieldValue, fieldValues) =>
                !fieldValue ||
                !fieldValues.startOfContract ||
                isAfter(
                  fieldValue,
                  moment(fieldValues.startOfContract).format('YYYY-MM-DD')
                ),
              message: 'Date antérieure à la date de début',
            },
          ],
        },
        {
          id: 'isPartTime',
          name: 'isPartTime',
          component: 'checkbox',
          title: 'Temps partiel',
        },
      ],
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
      id: 'businessLines',
      name: 'businessLines',
      title: 'Familles de métiers',
      component: 'select',
      isMulti: true,
      options: BUSINESS_LINES,
    },
    {
      id: 'link',
      name: 'link',
      component: 'text-input',
      title: "Lien de l'offre",
    },
    {
      id: 'externalOrigin',
      name: 'externalOrigin',
      component: 'select-simple',
      options: EXTERNAL_OFFERS_ORIGINS,
      title: 'Offre venant de',
    },
  ],
};
