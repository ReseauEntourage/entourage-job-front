import moment from 'moment';
import { isAfter } from 'validator';
import { FormSchema } from '../FormSchema';
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
import { FilterConstant } from 'src/constants/utils';
import { findConstantFromValue } from 'src/utils';

export const formEditExternalOpportunityAsAdmin: FormSchema<{
  status: OfferStatus;
  title: string;
  company: string;
  contract: Contract;
  startOfContract: string;
  endOfContract: string;
  isPartTime: boolean;
  department: FilterConstant<Department>;
  businessLines: FilterConstant<BusinessLineValue>[];
  link: string;
  description: string;
  externalOrigin: ExternalOfferOrigin;
  recruiterFirstName: string;
  recruiterName: string;
  recruiterMail: string;
}> = {
  id: 'form-edit-offer-external',
  fields: [
    {
      id: 'candidateStatus',
      name: 'candidateStatus',
      component: 'fieldgroup',
      fields: [
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
      maxLength: 255,
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
