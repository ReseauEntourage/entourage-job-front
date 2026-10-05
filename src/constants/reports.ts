// Motives of a report, shared by the messaging, profile and help group
// reports (same values as the back `ReportReasons`)
export const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Arnaque' },
  { value: 'INSULTS', label: 'Propos déplacés' },
  { value: 'IN_DANGER', label: 'Mise en danger' },
  { value: 'OTHER', label: 'Autre' },
] as const;

export type ReportReasonValue = (typeof REPORT_REASONS)[number]['value'];
