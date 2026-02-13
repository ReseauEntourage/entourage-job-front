import { FormSchema } from '../FormSchema';

const USER_REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Arnaque' },
  { value: 'INSULTS', label: 'Propos déplacés' },
  { value: 'IN_DANGER', label: 'Mise en danger' },
  { value: 'OTHER', label: 'Autre' },
];

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
