import { FormSchema } from 'src/components/forms/FormSchema';
import {
  HelpValue,
  ReferedCandidateHelpCardContents,
} from 'src/constants/helps';

export const formReferingExpectations: FormSchema<{
  helpNeeds: HelpValue[];
}> = {
  id: 'form-refering-candidate-expectations',
  fields: [
    {
      id: 'helpNeeds',
      name: 'helpNeeds',
      component: 'select-list',
      options: ReferedCandidateHelpCardContents,
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
