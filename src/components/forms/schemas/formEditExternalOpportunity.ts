import moment from 'moment';

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
import { FilterConstant } from 'src/constants/utils';
import { findConstantFromValue } from 'src/utils';

export const formEditExternalOpportunity: FormSchema<{
  status: OfferStatus;
  title: string;
  company: string;
  contract: Contract;
  startOfContract: string;
  endOfContract: string;
  isPartTime: boolean;
  department: FilterConstant<Department>;
  link: string;
  description: string;
  externalOrigin: ExternalOfferOrigin;
}> = {
  id: 'form-offer-external',
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
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: "Titre de l'offre*",
      isRequired: true,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: "Nom de l'entreprise*",
      isRequired: true,
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
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
              method: (fieldValue, fieldValues) => {
                return !(
                  !!fieldValue &&
                  !!fieldValues.startOfContract &&
                  moment(fieldValue, 'YYYY-MM-DD').isBefore(
                    moment(fieldValues.startOfContract as string, 'YYYY-MM-DD')
                  )
                );
              },
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
      id: 'department',
      name: 'department',
      title: 'Département*',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: true,
    },
    {
      id: 'link',
      name: 'link',
      component: 'text-input',
      title: "Lien de l'offre",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: "Description de l'offre",
      maxLength: 2000,
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
}> = {
  id: 'form-offer-external',
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
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: "Titre de l'offre*",
      isRequired: true,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: "Nom de l'entreprise*",
      isRequired: true,
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
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
              method: (fieldValue, fieldValues) => {
                return !(
                  !!fieldValue &&
                  !!fieldValues.startOfContract &&
                  moment(fieldValue, 'YYYY-MM-DD').isBefore(
                    moment(fieldValues.startOfContract as string, 'YYYY-MM-DD')
                  )
                );
              },
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
      id: 'businessLines',
      name: 'businessLines',
      title: 'Familles de métiers',
      component: 'select',
      isMulti: true,
      options: BUSINESS_LINES,
    },
    {
      id: 'department',
      name: 'department',
      title: 'Département*',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: true,
    },
    {
      id: 'link',
      name: 'link',
      component: 'text-input',
      title: "Lien de l'offre",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: "Description de l'offre",
      maxLength: 2000,
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
