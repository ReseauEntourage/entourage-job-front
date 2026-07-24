// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import {
  getRecapSuggestedMessage,
  RecapCandidateProfileSource,
} from './RecapSuggestedMessage.utils';

const emptyCandidateProfile: RecapCandidateProfileSource = {
  sectorOccupations: [],
};

const candidateProfileWithSectorOccupation: RecapCandidateProfileSource = {
  sectorOccupations: [
    {
      id: 'so-1',
      order: 0,
      businessSector: {
        id: 'sector-1',
        name: 'Restauration et hôtellerie',
        prefixes: "la,l'",
      },
      occupation: { id: 'occ-1', name: 'Serveur' },
    },
  ],
};

const candidateProfileWithVowelSectorOccupation: RecapCandidateProfileSource = {
  sectorOccupations: [
    {
      id: 'so-2',
      order: 0,
      businessSector: {
        id: 'sector-2',
        name: 'Agriculture et espaces verts',
        prefixes: "l',les",
      },
      occupation: { id: 'occ-2', name: "Éleveur de vifs d'or" },
    },
  ],
};

const cvNudge = {
  id: 'nudge-cv',
  value: 'cv',
  nameRequest: 'Réaliser son CV et ses lettres de motivation',
  nameOffer: 'Aider à réaliser un CV et une lettre de motivation',
  order: 0,
};

const interviewNudge = {
  id: 'nudge-interview',
  value: 'interview',
  nameRequest: "Se préparer aux entretiens d'embauche",
  nameOffer: "Aider à préparer les entretiens d'embauche",
  order: 1,
};

const networkNudge = {
  id: 'nudge-network',
  value: 'network',
  nameRequest: 'Faire grandir son réseau professionnel',
  nameOffer: 'Partager mon réseau professionnel',
  order: 2,
};

describe('getRecapSuggestedMessage', () => {
  it('utilise le gabarit candidat→coach et signe avec le prénom du candidat', () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.CANDIDATE,
      senderFirstName: 'Sofia',
      recipientFirstName: 'Karim',
      candidateProfile: emptyCandidateProfile,
    });

    expect(message).toContain('Bonjour Karim,');
    expect(message).toContain('Je recherche un poste de');
    expect(message.endsWith('Sofia')).toBe(true);
  });

  it('utilise le gabarit coach→candidat et signe avec le prénom du coach', () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.COACH,
      senderFirstName: 'Karim',
      recipientFirstName: 'Sofia',
      candidateProfile: emptyCandidateProfile,
    });

    expect(message).toContain('Bonjour Sofia,');
    expect(message).toContain('Je vois que vous recherchez un poste de');
    expect(message.endsWith('Karim')).toBe(true);
  });

  it('insère le métier et le secteur (avec accord grammatical) quand sectorOccupations est renseigné', () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.COACH,
      senderFirstName: 'Karim',
      recipientFirstName: 'Sofia',
      candidateProfile: candidateProfileWithSectorOccupation,
    });

    expect(message).toContain(
      "Je vois que vous recherchez un poste de serveur dans la restauration et l'hôtellerie."
    );
  });

  it("élide « de » en « d' » devant un métier commençant par un son voyelle, et accorde l'article du secteur mot par mot", () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.COACH,
      senderFirstName: 'Karim',
      recipientFirstName: 'Harry',
      candidateProfile: candidateProfileWithVowelSectorOccupation,
    });

    expect(message).toContain(
      "Je vois que vous recherchez un poste d'éleveur de vifs d'or dans l'agriculture et les espaces verts."
    );
  });

  it('utilise le repli [...] pour métier/secteur quand sectorOccupations est absent', () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.CANDIDATE,
      senderFirstName: 'Sofia',
      recipientFirstName: 'Karim',
      candidateProfile: emptyCandidateProfile,
    });

    expect(message).toContain('Je recherche un poste de [...] dans [...]');
  });

  it("insère un seul coup de pouce commun avec le connecteur 'pour'", () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.CANDIDATE,
      senderFirstName: 'Sofia',
      recipientFirstName: 'Karim',
      candidateProfile: emptyCandidateProfile,
      candidateNudges: [cvNudge],
      coachNudges: [cvNudge],
    });

    expect(message).toContain(
      "j'aimerais un coup de pouce pour Réaliser son CV et ses lettres de motivation."
    );
  });

  it('joint plusieurs coups de pouce communs en énumération "a, b et c"', () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.COACH,
      senderFirstName: 'Karim',
      recipientFirstName: 'Sofia',
      candidateProfile: emptyCandidateProfile,
      candidateNudges: [cvNudge, interviewNudge, networkNudge],
      coachNudges: [cvNudge, interviewNudge, networkNudge],
    });

    expect(message).toContain(
      "Je serais ravi de vous donner un coup de pouce pour Réaliser son CV et ses lettres de motivation, Se préparer aux entretiens d'embauche et Faire grandir son réseau professionnel."
    );
  });

  it("ne retient que l'intersection des nudges du candidat et du coach", () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.CANDIDATE,
      senderFirstName: 'Sofia',
      recipientFirstName: 'Karim',
      candidateProfile: emptyCandidateProfile,
      candidateNudges: [cvNudge, interviewNudge],
      coachNudges: [interviewNudge, networkNudge],
    });

    expect(message).toContain(
      "j'aimerais un coup de pouce pour Se préparer aux entretiens d'embauche."
    );
    expect(message).not.toContain('CV');
    expect(message).not.toContain('réseau');
  });

  it("omet entièrement la clause de coup de pouce quand aucun nudge n'est commun (candidat→coach)", () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.CANDIDATE,
      senderFirstName: 'Sofia',
      recipientFirstName: 'Karim',
      candidateProfile: emptyCandidateProfile,
      candidateNudges: [cvNudge],
      coachNudges: [networkNudge],
    });

    expect(message).toContain(
      'Je recherche un poste de [...] dans [...]. Votre expérience'
    );
    expect(message).not.toContain('coup de pouce');
  });

  it("omet entièrement la clause de coup de pouce quand aucun nudge n'est commun (coach→candidat)", () => {
    const message = getRecapSuggestedMessage({
      senderRole: UserRoles.COACH,
      senderFirstName: 'Karim',
      recipientFirstName: 'Sofia',
      candidateProfile: emptyCandidateProfile,
    });

    expect(message).toContain(
      'Je vois que vous recherchez un poste de [...] dans [...]. Dites-moi où vous en êtes'
    );
    expect(message).not.toContain('coup de pouce');
  });
});
