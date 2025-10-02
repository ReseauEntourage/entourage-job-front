import { FilterConstant } from '@/src/constants/utils';
import { FileTypes, FormComponents, FormSchema } from '../FormSchema';
import {
  loadBusinessSectorsOptions,
  loadDepartmentsOptions,
} from '../utils/loadOptions.utils';

export const formEditCompanyInfos: FormSchema<{
  departmentId: FilterConstant<string>;
  businessSectorIds: FilterConstant<string>[];
  logo: File;
}> = {
  id: 'form-interests',
  fields: [
    {
      id: 'logo',
      name: 'logo',
      title: 'Logo',
      component: FormComponents.FILE,
      fileType: FileTypes.LOGO,
      showLabel: true,
      accept: '.png',
    },
    {
      id: 'infoLogo',
      name: 'infoLogo',
      component: FormComponents.TEXT,
      title: 'Seul un logo au format PNG avec transparence est accepté',
    },
    {
      id: 'businessSectorIds',
      name: 'businessSectorIds',
      title: 'Secteur d’activité',
      component: 'select-async',
      loadOptions: loadBusinessSectorsOptions,
      placeholder: 'Sélectionnez dans la liste',
      isMulti: true,
      showLabel: true,
    },
    {
      id: 'departmentId',
      name: 'departmentId',
      title: 'Département',
      component: 'select-async',
      loadOptions: loadDepartmentsOptions,
      placeholder: 'Sélectionnez un département',
      isRequired: true,
      showLabel: true,
      isMulti: false,
    },
  ],
};
