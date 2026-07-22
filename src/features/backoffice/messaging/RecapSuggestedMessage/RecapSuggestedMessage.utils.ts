import {
  BusinessSector,
  Nudge,
  UserProfileSectorOccupation,
} from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';

const FALLBACK = '[...]';

const VOWEL_SOUND_PATTERN = /^[aeiouyàâäéèêëîïôöùûü]/;

const lowerFirst = (word: string): string =>
  word.length > 0
    ? word.charAt(0).toLocaleLowerCase('fr-FR') + word.slice(1)
    : word;

// "un poste de [occupation]" → elision to "d'" before a vowel sound
// (e.g. "un poste d'éleveur"), there's no dedicated field on Occupation for this.
const formatOccupationClause = (occupationName?: string): string => {
  if (!occupationName) {
    return `de ${FALLBACK}`;
  }
  const label = lowerFirst(occupationName);
  return VOWEL_SOUND_PATTERN.test(label) ? `d'${label}` : `de ${label}`;
};

// `BusinessSector.prefixes` is a list of already-agreed articles, one per
// word of the sector name split on " et " (e.g. "la,l'" for
// "Restauration et hôtellerie" → "la restauration et l'hôtellerie").
// They're reapplied one by one rather than guessing a global agreement.
const formatSectorClause = (businessSector?: BusinessSector): string => {
  if (!businessSector?.name) {
    return FALLBACK;
  }
  const nameParts = businessSector.name.split(' et ');
  const prefixes = businessSector.prefixes
    ? businessSector.prefixes.split(',').map((prefix) => prefix.trim())
    : [];

  return nameParts
    .map((namePart, index) => {
      const label = lowerFirst(namePart);
      const prefix = prefixes[index];
      if (!prefix) {
        return label;
      }
      return prefix.endsWith("'") ? `${prefix}${label}` : `${prefix} ${label}`;
    })
    .join(' et ');
};

export interface RecapCandidateProfileSource {
  sectorOccupations?: UserProfileSectorOccupation[] | null;
}

interface GetRecapSuggestedMessageParams {
  senderRole: UserRoles;
  senderFirstName: string;
  recipientFirstName: string;
  // Always the candidate's profile, whether they're the sender (candidate
  // contacting a coach) or the recipient (coach contacting a recommended
  // candidate): the occupation/sector information shown always describes
  // the candidate's situation.
  candidateProfile: RecapCandidateProfileSource;
  // Structured nudges from both sides of the conversation (candidate and
  // coach), needed to only suggest what they have in common — unlike
  // formatSectorClause above, these aren't the nudges of a single profile.
  candidateNudges?: Nudge[] | null;
  coachNudges?: Nudge[] | null;
}

const joinWithAnd = (items: string[]): string => {
  if (items.length === 1) {
    return items[0];
  }
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
};

// Only keep structured nudges (shared catalog, identified by id) present on
// both the candidate's and the coach's side: customNudges (free text) have
// no shared identifier to match them by.
const getCommonNudgeLabels = (
  candidateNudges?: Nudge[] | null,
  coachNudges?: Nudge[] | null
): string[] => {
  const coachNudgeIds = new Set((coachNudges ?? []).map((nudge) => nudge.id));
  return (candidateNudges ?? [])
    .filter((nudge) => coachNudgeIds.has(nudge.id))
    .map((nudge) => nudge.nameRequest);
};

export const getRecapSuggestedMessage = ({
  senderRole,
  senderFirstName,
  recipientFirstName,
  candidateProfile,
  candidateNudges,
  coachNudges,
}: GetRecapSuggestedMessageParams): string => {
  const [firstSectorOccupation] = candidateProfile.sectorOccupations ?? [];
  const occupationClause = formatOccupationClause(
    firstSectorOccupation?.occupation?.name
  );
  const sectorClause = formatSectorClause(
    firstSectorOccupation?.businessSector
  );
  const commonNudgeLabels = getCommonNudgeLabels(candidateNudges, coachNudges);
  const nudgeText =
    commonNudgeLabels.length > 0 ? joinWithAnd(commonNudgeLabels) : null;

  if (senderRole === UserRoles.CANDIDATE) {
    const nudgeClause = nudgeText
      ? ` et j'aimerais un coup de pouce pour ${nudgeText}`
      : '';
    return `Bonjour ${recipientFirstName},\nJe recherche un poste ${occupationClause} dans ${sectorClause}${nudgeClause}. Votre expérience m'aiderait beaucoup. Seriez-vous d'accord pour échanger ?\n${senderFirstName}`;
  }

  const nudgeSentence = nudgeText
    ? ` Je serais ravi de vous donner un coup de pouce pour ${nudgeText}.`
    : '';
  return `Bonjour ${recipientFirstName},\nJe vois que vous recherchez un poste ${occupationClause} dans ${sectorClause}.${nudgeSentence} Dites-moi où vous en êtes, on en parle quand vous voulez.\n${senderFirstName}`;
};
