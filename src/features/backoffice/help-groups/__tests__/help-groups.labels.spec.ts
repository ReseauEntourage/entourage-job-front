// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  DELETED_AUTHOR_LABEL,
  formatAuthorName,
  formatAuthorRoleLabel,
  formatMembersLabel,
  formatReactionsLabel,
  formatRepliesLabel,
  getAuthorInitials,
  HELP_GROUP_NO_MEMBER_LABEL,
} from '../help-groups.labels';

describe('help groups labels', () => {
  describe('formatMembersLabel', () => {
    it('never shows zero members', () => {
      expect(formatMembersLabel(0, false)).toBe(HELP_GROUP_NO_MEMBER_LABEL);
      expect(formatMembersLabel(0, false)).not.toMatch(/0/);
    });
    it('uses the singular for one member', () => {
      expect(formatMembersLabel(1, false)).toBe('1 membre');
    });
    it('uses the plural for several members', () => {
      expect(formatMembersLabel(128, false)).toBe('128 membres');
    });
    it('mentions the reader when member', () => {
      expect(formatMembersLabel(61, true)).toBe('61 membres, dont vous');
      expect(formatMembersLabel(1, true)).toBe('1 membre, dont vous');
    });
  });

  describe('formatRepliesLabel', () => {
    it('shows nothing without replies', () => {
      expect(formatRepliesLabel(0)).toBeNull();
    });
    it('uses the singular and the plural', () => {
      expect(formatRepliesLabel(1)).toBe('1 réponse');
      expect(formatRepliesLabel(4)).toBe('4 réponses');
    });
  });

  describe('formatReactionsLabel', () => {
    it('shows nothing without reactions', () => {
      expect(formatReactionsLabel(null)).toBeNull();
      expect(formatReactionsLabel({ firstNames: [], hasOthers: false })).toBe(
        null
      );
    });
    it('handles one, two and three people', () => {
      expect(
        formatReactionsLabel({ firstNames: ['Julien'], hasOthers: false })
      ).toBe('Julien soutient');
      expect(
        formatReactionsLabel({
          firstNames: ['Amina', 'Sofia'],
          hasOthers: false,
        })
      ).toBe('Amina et Sofia soutiennent');
      expect(
        formatReactionsLabel({
          firstNames: ['Amina', 'Sofia', 'Malik'],
          hasOthers: false,
        })
      ).toBe('Amina, Sofia et Malik soutiennent');
    });
    it('adds "et d\'autres" beyond three people, without any number', () => {
      const label = formatReactionsLabel({
        firstNames: ['Amina', 'Sofia', 'Malik'],
        hasOthers: true,
      });
      expect(label).toBe("Amina, Sofia, Malik et d'autres soutiennent");
      expect(label).not.toMatch(/\d/);
    });
  });

  describe('authors', () => {
    const author = {
      isDeleted: false,
      firstName: 'Amina',
      lastNameInitial: 'L.',
      roleLabel: 'Coach',
    };
    const deleted = {
      isDeleted: true,
      firstName: null as string | null,
      lastNameInitial: null as string | null,
      roleLabel: null as string | null,
    };

    it('formats the name with the last name initial', () => {
      expect(formatAuthorName(author)).toBe('Amina L.');
      expect(getAuthorInitials(author)).toBe('AL');
    });
    it('formats the role labels', () => {
      expect(formatAuthorRoleLabel(author)).toBe('Coach');
      expect(
        formatAuthorRoleLabel({ ...author, roleLabel: 'Équipe Entourage' })
      ).toBe('Équipe Entourage');
    });
    it('hides the identity of a deleted account', () => {
      expect(formatAuthorName(deleted)).toBe(DELETED_AUTHOR_LABEL);
      expect(formatAuthorRoleLabel(deleted)).toBeNull();
      expect(getAuthorInitials(deleted)).toBeNull();
    });
  });
});
