import { Api } from '@/src/api';
import { FilterConstant } from '@/src/constants/utils';
import { FileTypes, FormComponents, FormSchema } from '../FormSchema';

const loadDepartmentsOptions = async (callback, inputValue) => {
  try {
    const { data: departments } = await Api.getAllDepartments({
      search: inputValue,
    });
    callback([
      ...departments.map((u) => {
        return {
          value: u.id,
          label: `${u.value} - ${u.name}`,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
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
      placeholder: 'Séléctionnez un département',
      isRequired: true,
      showLabel: true,
      isMulti: false,
    },
  ],
};
