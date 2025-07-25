import React from 'react';
import { Api } from '@/src/api';
import { FilterConstant } from '@/src/constants/utils';
import {
  FormSchema,
  FormSchemaValidation,
  GetValueType,
} from 'src/components/forms/FormSchema';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';

export const CREATE_NEW_COMPANY_VALUE = 'createNewCompany';

interface FormRegistrationCompanySelectionSchema extends FormSchemaValidation {
  companyId: FilterConstant<string>;
}

const hideOrganizationFields = (
  getValue: GetValueType<FormRegistrationCompanySelectionSchema>
) => {
  const companyId = getValue('companyId')?.value;
  return companyId !== CREATE_NEW_COMPANY_VALUE;
};

const CREATE_NEW_COMPANY_OPTION = {
  value: CREATE_NEW_COMPANY_VALUE,
  label: (
    <>
      <LucidIcon name="Plus" />
      Ajouter une nouvelle entreprise
    </>
  ),
};

export const formRegistrationCompanySelection: FormSchema<FormRegistrationCompanySelectionSchema> =
  {
    id: 'form-registration-company-selection',
    fields: [
      {
        id: 'companyId',
        name: 'companyId',
        component: 'select-async',
        isRequired: true,
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: companies } = await Api.getAllCompanies({
              params: {
                search: inputValue,
                limit: 50,
                offset: 0,
              },
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
        title: 'Sélectionnez votre entreprise *',
        isMulti: false,
        showLabel: true,
      },
      {
        id: 'companyName',
        name: 'companyName',
        component: 'text-input',
        title: 'Nom de votre entreprise *',
        showLabel: true,
        isRequired: true,
        hide: hideOrganizationFields,
      },
    ],
  };
