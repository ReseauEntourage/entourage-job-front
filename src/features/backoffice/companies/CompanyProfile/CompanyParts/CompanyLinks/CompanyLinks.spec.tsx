import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { CompanyLinks } from './CompanyLinks';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
const mockUpdateCompany = jest.fn();
jest.mock('@/src/hooks/useUpdateCompany', () => ({
  useUpdateCompany: () => ({ updateCompany: mockUpdateCompany }),
}));
jest.mock('../../../modals/CompanyLinksModalEdit', () => ({
  CompanyLinksModalEdit: () => null,
}));

describe('CompanyLinks', () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tells visitors the company has not filled its links yet', () => {
    render(<CompanyLinks name="Acme" />);
    expect(
      screen.getByText("Acme n'a pas encore renseigné ses informations")
    ).toBeInTheDocument();
    expect(screen.queryByText('Modifier')).toBeNull();
  });

  it('invites an editor to add links, and opens the edit modal', () => {
    render(<CompanyLinks name="Acme" isEditable />);
    expect(
      screen.getByText(/Ajoutez les liens utiles pour que les candidats/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Modifier'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('lists only the provided links', () => {
    render(<CompanyLinks name="Acme" url="acme.fr" />);
    expect(screen.getByText('Site internet')).toBeInTheDocument();
    expect(screen.queryByText('LinkedIn')).toBeNull();
    expect(screen.queryByText('Site de recrutement')).toBeNull();
  });

  it('opens each link in a new tab, defaulting to http when no protocol', () => {
    render(
      <CompanyLinks
        name="Acme"
        url="acme.fr"
        linkedInUrl="https://linkedin.com/company/acme"
        hiringUrl="http://jobs.acme.fr"
      />
    );
    fireEvent.click(screen.getByText('Site internet'));
    expect(openSpy).toHaveBeenLastCalledWith('http://acme.fr', '_blank');
    fireEvent.click(screen.getByText('LinkedIn'));
    expect(openSpy).toHaveBeenLastCalledWith(
      'https://linkedin.com/company/acme',
      '_blank'
    );
    fireEvent.click(screen.getByText('Site de recrutement'));
    expect(openSpy).toHaveBeenLastCalledWith('http://jobs.acme.fr', '_blank');
  });
});
