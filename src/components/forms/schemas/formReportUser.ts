import { FormSchema } from '../FormSchema';
import { USER_REPORT_REASONS } from 'src/constants/users';

export const formReportUser: FormSchema<{
  reason: string;
  comment: string;
}> = {
  id: 'form-add-organization',
  fields: [
    {
      id: 'reason',
      name: 'reason',
      component: 'select-simple',
      title: 'Raison du signalement *',
      options: USER_REPORT_REASONS,
      isRequired: true,
    },
    {
      id: 'comment',
      name: 'comment',
      component: 'text-input',
      title: 'Commentaire *',
      isRequired: true,
    },
  ],
};
