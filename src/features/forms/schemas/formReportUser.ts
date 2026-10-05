import { REPORT_REASONS } from '@/src/constants/reports';
import { FormSchema } from '../FormSchema';

const USER_REPORT_REASONS = REPORT_REASONS.map(({ value, label }) => ({
  value,
  label,
}));

export const formReportUser: FormSchema<{
  reason: string;
  comment: string;
}> = {
  id: 'form-report-user',
  fields: [
    {
      id: 'reason',
      name: 'reason',
      component: 'select-simple',
      title: 'Raison du signalement *',
      options: USER_REPORT_REASONS,
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'comment',
      name: 'comment',
      component: 'text-input',
      title: 'Commentaire *',
      isRequired: true,
      showLabel: true,
    },
  ],
};
