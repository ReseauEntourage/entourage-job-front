import React from 'react';
import { LucidIcon } from '../../utils';
import { FormSchema, FormSchemaValidation, GetValueType } from '../FormSchema';
import { Api } from 'src/api';
import { FilterConstant } from 'src/constants/utils';

export const CREATE_NEW_COMPANY_VALUE = 'createNewCompany';

const CREATE_NEW_COMPANY_OPTION = {
  value: CREATE_NEW_COMPANY_VALUE,
  label: (
    <>
      <LucidIcon name="Plus" />
      Ajouter une nouvelle entreprise
    </>
  ),
};

const loadBusinessSectorsOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllBusinessSectors({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

interface formEditCoachProfessionalInformationFormSchema
  extends FormSchemaValidation {
  currentJob: string;
  companyId: FilterConstant<string>;
  companyName: string;
  businessSectorIds: FilterConstant<string>[];
}

const hideCompanyNameField = (
  getValue: GetValueType<formEditCoachProfessionalInformationFormSchema>
) => {
  const companyId = getValue('companyId')?.value;
  return companyId !== CREATE_NEW_COMPANY_VALUE;
};

export const formEditCoachProfessionalInformation: FormSchema<formEditCoachProfessionalInformationFormSchema> =
  {
    id: 'form-coach-professional-information',
    fields: [
      {
        id: 'currentJob',
        name: 'currentJob',
        component: 'text-input',
        title: 'Mon métier',
      },
      {
        id: 'companyId',
        name: 'companyId',
        component: 'select-async',
        title: 'Mon entreprise',
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: companies } = await Api.getAllCompanies({
              search: inputValue,
              limit: 50,
              offset: 0,
              departments: [],
              businessSectorIds: [],
            });
            callback([
              ...companies.map((u) => {
                return {
                  value: u.id,
                  label: u.name,
                  key: u.id,
                };
              }),
              CREATE_NEW_COMPANY_OPTION,
            ]);
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        placeholder: 'Mon entreprise',
        isMulti: false,
      },
      {
        id: 'companyName',
        name: 'companyName',
        component: 'text-input',
        title: 'Nom de votre entreprise *',
        showLabel: true,
        isRequired: true,
        hide: hideCompanyNameField,
      },
      {
        id: 'businessSectorIds',
        name: 'businessSectorIds',
        component: 'select-async',
        isRequired: true,
        loadOptions: loadBusinessSectorsOptions,
        placeholder: "Les secteurs dans lesquels j'ai du réseau*",
        isMulti: true,
        showLabel: true,
      },
    ],
  };
