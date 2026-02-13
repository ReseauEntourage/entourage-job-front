import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { UserRoles } from '@/src/constants/users';
import { FormSchema } from '@/src/features/forms/FormSchema';
import { loadNudgesOptions } from '@/src/features/forms/utils/loadOptions.utils';

export const formReferingExpectations: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-refering-candidate-expectations',
  fields: [
    {
      id: 'nudgeIds',
      name: 'nudgeIds',
      component: 'select-list-async',
      isMulti: true,
      showLabel: false,
      isRequired: true,
      loadOptions: async (callback) => {
        await loadNudgesOptions(UserRoles.CANDIDATE, (options) => {
          callback(
            options.map((option) => ({
              value: option.value,
              label: (
                <SelectOptionTitleIconDescriptionLabel
                  title={option.label}
                  icon={option.icon}
                  description={option.description}
                />
              ),
            }))
          );
        });
      },
    },
  ],
};
