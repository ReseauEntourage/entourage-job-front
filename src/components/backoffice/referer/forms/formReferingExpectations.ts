import { Api } from '@/src/api';
import { createNudgeOption } from '@/src/constants/nudges';
import { FormSchema } from 'src/components/forms/FormSchema';

const loadNudgesOptions = async (callback) => {
  try {
    const { data: nudges } = await Api.getAllNudges({
      search: '',
      limit: 50,
      offset: 0,
    });
    callback([
      ...nudges.map((n) => createNudgeOption('Candidat', n)).filter((n) => n),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const formReferingExpectations: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-refering-candidate-expectations',
  fields: [
    {
      id: 'nudgeIds',
      name: 'nudgeIds',
      component: 'select-list-async',
      loadOptions: loadNudgesOptions,
      isMulti: true,
      showLabel: false,
      isRequired: true,
    },
  ],
};
