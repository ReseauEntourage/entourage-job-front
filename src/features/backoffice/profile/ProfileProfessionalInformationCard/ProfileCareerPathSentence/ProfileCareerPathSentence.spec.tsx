import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { ProfileCareerPathSentence } from './ProfileCareerPathSentence';

const so = (
  id: string,
  sector: string,
  occupation?: string,
  prefixes?: string
) =>
  ({
    id,
    businessSector: { name: sector, prefixes },
    occupation: occupation ? { name: occupation } : undefined,
  }) as any;

describe('ProfileCareerPathSentence', () => {
  describe('for a coach', () => {
    it('says the current job and company, linking to the company page when it has an admin', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.COACH}
          sectorOccupations={[]}
          currentJob="Développeur"
          company={{
            id: 'c1',
            name: 'Acme',
            admin: { firstName: 'A', lastName: 'B' },
          }}
        />
      );

      expect(screen.getByText('Développeur')).toBeInTheDocument();
      expect(screen.getByText('Acme').closest('a')).toHaveAttribute(
        'href',
        '/backoffice/companies/c1'
      );
    });

    it('shows the company without a link when it has no admin', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.COACH}
          sectorOccupations={[]}
          company={{ id: 'c1', name: 'Acme' }}
        />
      );

      expect(screen.getByText('Acme').closest('a')).toBeNull();
      expect(screen.queryByText(/comme/)).not.toBeInTheDocument();
    });

    it('says nothing about work without job nor company', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.COACH}
          sectorOccupations={[]}
        />
      );

      expect(screen.queryByText(/Je travaille/)).not.toBeInTheDocument();
      expect(screen.queryByText(/J'ai du réseau dans/)).not.toBeInTheDocument();
    });

    it('lists the business sectors the coach has a network in, as tags or plain text', () => {
      const sectors = [so('1', 'Tech'), so('2', 'Santé')];
      const { unmount } = render(
        <ProfileCareerPathSentence
          role={UserRoles.COACH}
          sectorOccupations={sectors}
        />
      );
      expect(screen.getByText("J'ai du réseau dans :")).toBeInTheDocument();
      expect(screen.getByText('Tech')).toBeInTheDocument();
      expect(screen.getByText('Santé')).toBeInTheDocument();
      unmount();

      render(
        <ProfileCareerPathSentence
          role={UserRoles.COACH}
          sectorOccupations={sectors}
          asSimpleSentence
        />
      );
      expect(screen.getByText('Tech')).toBeInTheDocument();
    });
  });

  describe('for a candidate', () => {
    it('is open to all opportunities without sector', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          sectorOccupations={[]}
        />
      );

      expect(
        screen.getByText('Je suis ouvert à toutes les opportunités')
      ).toBeInTheDocument();
    });

    it('states the first sector with its occupation', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          sectorOccupations={[so('1', 'Tech', 'Développeur')]}
        />
      );

      expect(screen.getByText('Tech')).toBeInTheDocument();
      expect(screen.getByText('Développeur')).toBeInTheDocument();
      expect(screen.getByText(/comme/)).toBeInTheDocument();
    });

    it('omits the occupation when there is none', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          sectorOccupations={[so('1', 'Tech')]}
        />
      );

      expect(screen.queryByText(/comme/)).not.toBeInTheDocument();
    });

    it('joins two occupations of the same sector with "et"', () => {
      const { container } = render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          sectorOccupations={[
            so('1', 'Tech', 'Développeur'),
            so('2', 'Tech', 'Testeur'),
          ]}
        />
      );

      expect(container).toHaveTextContent(/comme Développeur et Testeur/);
      expect(screen.getAllByText('Tech')).toHaveLength(1);
    });

    it('repeats the sentence for a second, different sector', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          sectorOccupations={[
            so('1', 'Tech', 'Développeur'),
            so('2', 'Santé', 'Infirmier'),
          ]}
        />
      );

      expect(screen.getByText('Santé')).toBeInTheDocument();
      expect(screen.getByText('Infirmier')).toBeInTheDocument();
      expect(
        screen.getAllByText(/J'aimerais travailler dans/).length
      ).toBeGreaterThan(0);
    });

    it('uses a compact sentence with sector prefixes when asked', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          asSimpleSentence
          sectorOccupations={[
            so('1', 'Tech', 'Développeur', "l'informatique,la tech"),
            so('2', 'Santé', undefined, 'la santé,le soin'),
          ]}
        />
      );

      expect(screen.getByText("l'informatique")).toBeInTheDocument();
      expect(screen.getByText(/ou dans/)).toBeInTheDocument();
      expect(screen.getByText('Santé')).toBeInTheDocument();
      expect(screen.getByText('Développeur')).toBeInTheDocument();
    });

    it('uses the compact sentence for two occupations of the same sector', () => {
      render(
        <ProfileCareerPathSentence
          role={UserRoles.CANDIDATE}
          asSimpleSentence
          sectorOccupations={[
            so('1', 'Tech', 'Développeur'),
            so('2', 'Tech', 'Testeur'),
          ]}
        />
      );

      expect(screen.getByText('Testeur')).toBeInTheDocument();
    });
  });

  describe('for the other roles', () => {
    [UserRoles.ADMIN, UserRoles.REFERER].forEach((role) => {
      it(`uses the coach wording for ${role}`, () => {
        render(
          <ProfileCareerPathSentence
            role={role}
            sectorOccupations={[so('1', 'Tech', 'Développeur')]}
          />
        );

        expect(screen.getByText("J'ai du réseau dans :")).toBeInTheDocument();
        expect(
          screen.queryByText(/J'aimerais travailler dans/)
        ).not.toBeInTheDocument();
      });
    });

    it('never shows job-search wording for an admin without sector', () => {
      const { container } = render(
        <ProfileCareerPathSentence
          role={UserRoles.ADMIN}
          sectorOccupations={[]}
        />
      );

      expect(container).not.toHaveTextContent(/opportunités/);
      expect(container).not.toHaveTextContent(/aimerais travailler/);
    });
  });
});
