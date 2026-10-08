// Provisional labels (Open Questions of the design), except those validated
// by the PM on 01/10/2026
export const REPORT_MODAL_LABELS = {
  text: 'L’équipe Entourage lit chaque signalement et intervient si besoin. La personne signalée n’est pas prévenue.',
  reasonLabel: 'Motif',
  reasonRequired: 'Choisissez un motif.',
  commentLabel: 'Commentaire (facultatif)',
  // Accessible name of the recalled message
  excerptLabel: 'Message signalé',
  formatExcerpt: (content: string) => `«\u00a0${content}\u00a0»`,
  // The number is rendered as a call link between the two parts
  helpBefore: 'Vous, ou la personne concernée, allez mal ? Le ',
  helpNumber: '3114',
  helpAfter: ' répond 24h/24, gratuitement.',
  formatReferent: (name: string) =>
    `Vous pouvez aussi écrire à ${name}, votre référent(e) Entourage :`,
  cancel: 'Annuler',
  confirm: 'Envoyer le signalement',
  // Validated by the PM on 01/10/2026
  done: 'Merci, l’équipe a été prévenue',
  alreadyReported: 'Vous avez déjà signalé ce contenu, l’équipe s’en occupe',
  error: 'Votre signalement n’a pas pu être envoyé. Réessayez.',
};

export const REPORT_MODAL_TITLES = {
  conversation: 'Signaler cette conversation',
  profile: 'Signaler ce profil',
  message: 'Signaler ce message',
};
