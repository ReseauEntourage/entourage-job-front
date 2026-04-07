import { AchievementProgressionEntry, CriterionStat } from 'src/api/types';

interface ModalMessage {
  title: string;
  subtitle: string;
}

type CriterionMessageFn = (
  criterion: CriterionStat,
  entry: AchievementProgressionEntry
) => ModalMessage;

/**
 * Per-criterion messages shown in the progression modal (Cas 2).
 * Add entries here when introducing criteria with new keys.
 */
const CRITERION_MODAL_MESSAGE: Record<string, CriterionMessageFn> = {
  conversationCount: (criterion, entry) => {
    const remaining = Math.max(0, criterion.threshold - criterion.currentValue);
    const title = `Vous avez aidé ${Math.round(
      criterion.currentValue
    )} candidat${criterion.currentValue > 1 ? 's' : ''} !`;

    if (remaining === 0) {
      const otherPendingCount = entry.criteria.filter(
        (c) => c.key !== criterion.key && c.currentValue < c.threshold
      ).length;
      return {
        title,
        subtitle:
          otherPendingCount > 0
            ? `Objectif atteint ! Il vous reste encore ${otherPendingCount} critère${
                otherPendingCount > 1 ? 's' : ''
              } à compléter pour décrocher le badge.`
            : `Objectif atteint !`,
      };
    }

    return {
      title,
      subtitle:
        remaining === 1
          ? `Plus qu'un seul échange pour décrocher le badge !`
          : `Plus que ${remaining} échanges pour décrocher le badge !`,
    };
  },

  responseRate: (_criterion, entry) => ({
    title: 'Continuez comme ça !',
    subtitle: `En répondant à vos candidats, vous augmentez votre taux de réponse nécessaire pour obtenir le badge ${entry.label}.`,
  }),
};

const OBTAINED_MESSAGE = (
  entry: AchievementProgressionEntry
): ModalMessage => ({
  title: `Badge "${entry.label}" obtenu !`,
  subtitle:
    'Vous faites partie des coachs les plus engagés. Votre profil est maintenant mis en avant auprès des candidats.',
});

const FALLBACK_MESSAGE = (entry: AchievementProgressionEntry): ModalMessage => {
  const pendingCount = entry.criteria.filter(
    (c) => c.currentValue < c.threshold
  ).length;
  return {
    title: 'Continuez comme ça !',
    subtitle:
      pendingCount > 0
        ? `Encore ${pendingCount} objectif${
            pendingCount > 1 ? 's' : ''
          } à atteindre pour décrocher le badge.`
        : 'Vous êtes à un pas du badge !',
  };
};

export function getModalMessage(
  entry: AchievementProgressionEntry,
  changedCriterionKey: string | null
): ModalMessage {
  // Case 1 (prioritaire) — badge just obtained
  if (changedCriterionKey === null) {
    return OBTAINED_MESSAGE(entry);
  }

  // Case 2 — specific criterion progressed
  const messageFn = CRITERION_MODAL_MESSAGE[changedCriterionKey];
  if (messageFn) {
    const criterion = entry.criteria.find((c) => c.key === changedCriterionKey);
    if (criterion) {
      return messageFn(criterion, entry);
    }
  }

  return FALLBACK_MESSAGE(entry);
}
