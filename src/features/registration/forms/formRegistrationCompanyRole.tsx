import {
  COMPANY_ROLES_FILTERS,
  CompanyRoleName,
} from '@/src/constants/company';
import { FilterConstant } from '@/src/constants/utils';
import { FormSchema } from 'src/features/forms/FormSchema';

export const formRegistrationCompanyRole: FormSchema<{
  companyRole: FilterConstant<CompanyRoleName>;
}> = {
  id: 'form-registration-company-role',
  fields: [
    {
      id: 'companyRole',
      name: 'companyRole',
      title: "Quel est votre rôle au sein de l'entreprise ?*",
      component: 'select',
      options: COMPANY_ROLES_FILTERS,
      isRequired: true,
      showLabel: true,
      isMulti: false,
    },
  ],
};
