import { FormComponents, FormSchema } from '../FormSchema';
import { loadSkillsOptions } from '../utils/loadOptions.utils';
import { FilterConstant } from 'src/constants/utils';

export const formEditSkills: FormSchema<{
  skills: FilterConstant<string>[];
}> = {
  id: 'form-skills',
  fields: [
    {
      id: 'skills',
      name: 'skills',
      component: FormComponents.SELECT_CREATABLE,
      loadOptions: (callback, inputValue) =>
        loadSkillsOptions(callback, inputValue, true),
      title: 'Compétences',
      maxChar: 50,
      maxItems: 50,
      isMulti: true,
    },
  ],
};
