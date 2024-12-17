import { FormSchema } from 'src/components/forms/FormSchema';
import {
  HelpValue,
  ReferingCandidateHelpCardContents,
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
      options: ReferingCandidateHelpCardContents,
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
