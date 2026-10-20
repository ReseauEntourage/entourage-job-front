import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { ProfileCareerPathSentence } from './ProfileCareerPathSentence';

const sectorOccupations = [
  {
    id: 'so-1',
    businessSector: { name: 'Logistique' },
    occupation: { name: 'Cariste' },
  },
] as unknown as UserProfileSectorOccupation[];

describe('ProfileCareerPathSentence', () => {
  [UserRoles.COACH, UserRoles.ADMIN].forEach((role) => {
    it(`uses the coach wording for ${role}`, () => {
      render(
        <ProfileCareerPathSentence
          role={role}
          sectorOccupations={sectorOccupations}
        />
      );

      expect(screen.getByText(/J'ai du réseau dans/)).toBeTruthy();
      expect(screen.queryByText(/J'aimerais travailler dans/)).toBeNull();
    });
  });

  it('keeps the candidate wording for a candidate', () => {
    render(
      <ProfileCareerPathSentence
        role={UserRoles.CANDIDATE}
        sectorOccupations={sectorOccupations}
      />
    );

    expect(screen.getByText(/J'aimerais travailler dans/)).toBeTruthy();
  });

  it('never shows job-search wording for an admin without sectors', () => {
    const { container } = render(
      <ProfileCareerPathSentence
        role={UserRoles.ADMIN}
        sectorOccupations={[]}
      />
    );

    expect(container.textContent).not.toMatch(/opportunités/);
    expect(container.textContent).not.toMatch(/aimerais travailler/);
  });
});
