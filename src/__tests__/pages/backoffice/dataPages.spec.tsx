jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockDispatch = jest.fn();
const mockSelectorValues: Record<string, unknown> = {};
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector(),
}));

jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="LoadingScreen" />,
}));
jest.mock('@/src/features/backoffice/LoadingScreen/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="LoadingScreen" />,
}));

const mockSelectedCompany: { value: any } = { value: null };
const mockCompanyCollab: { value: any } = { value: {} };
jest.mock('@/src/hooks/useSelectedCompany', () => ({
  useSelectedCompany: () => ({
    selectedCompany: mockSelectedCompany.value,
    ...mockCompanyCollab.value,
  }),
}));
jest.mock('@/src/use-cases/company', () => ({
  fetchSelectedCompanySelectors: {
    selectIsFetchSelectedCompanyRequested: () =>
      mockSelectorValues.companyRequested,
  },
  companyActions: {
    fetchSelectedCompanyWithCollaboratorsRequested: () => ({
      type: 'fetchCollab',
    }),
  },
}));
jest.mock(
  '@/src/features/backoffice/companies/CompanyProfile/CompanyProfile',
  () => ({ CompanyProfile: () => <div data-testid="CompanyProfile" /> })
);
jest.mock(
  '@/src/features/backoffice/companies/CompanyCollaboratorsList/CompanyCollaboratorsList',
  () => ({
    CompanyCollaboratorsList: ({ companyWithCollaborators }: any) => (
      <div data-testid="Collaborators">{companyWithCollaborators.name}</div>
    ),
  })
);
jest.mock(
  '@/src/features/backoffice/companies/CompanyParameters/CompanyParameters',
  () => ({
    CompanyParameters: ({ company }: any) => (
      <div data-testid="CompanyParameters">{company.name}</div>
    ),
  })
);
const mockCurrentUserCompany: { value: any } = { value: null };
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: () => mockCurrentUserCompany.value,
}));

const mockSelectedEvent: { value: any } = { value: null };
jest.mock('@/src/features/backoffice/events/Event/useSelectedEvent', () => ({
  useSelectedEvent: () => ({ selectedEvent: mockSelectedEvent.value }),
}));
jest.mock('@/src/features/backoffice/events/Event/Event', () => ({
  Event: () => <div data-testid="Event" />,
}));
jest.mock('@/src/use-cases/events', () => ({
  fetchSelectedEventSelectors: {
    selectIsFetchSelectedEventRequested: () =>
      mockSelectorValues.eventRequested,
  },
}));

const mockSelectedProfile: { value: any } = { value: null };
jest.mock('@/src/features/backoffice/profile/useSelectedProfile', () => ({
  useSelectedProfile: () => ({ selectedProfile: mockSelectedProfile.value }),
}));
jest.mock('@/src/features/backoffice/profile', () => ({
  Profile: () => <div data-testid="Profile" />,
}));
jest.mock('@/src/use-cases/profiles', () => ({
  fetchSelectedProfileSelectors: {
    selectIsFetchSelectedProfileRequested: () =>
      mockSelectorValues.profileRequested,
  },
}));

jest.mock('@/src/use-cases/current-user', () => ({
  selectCurrentUser: () => mockSelectorValues.currentUser,
}));
jest.mock('@/src/features/backoffice/alertCandidates/AlertCandidates', () => ({
  AlertCandidates: ({ alertId }: any) => (
    <div data-testid="AlertCandidates">{alertId}</div>
  ),
}));

const mockReferingRedirection = { isLoading: false };
jest.mock(
  '@/src/features/backoffice/referer/Refering/useReferingRedirection',
  () => ({ useReferingRedirection: () => mockReferingRedirection })
);
jest.mock('@/src/features/backoffice/referer/Refering/Refering', () => ({
  Refering: () => <div data-testid="Refering" />,
}));
const mockConfirmationRedirection = { isLoading: false };
jest.mock(
  '@/src/features/backoffice/referer/Refering/Confirmation/useConfirmationRedirection',
  () => ({ useConfirmationRedirection: () => mockConfirmationRedirection })
);
jest.mock('@/src/features/backoffice/referer/Refering/Confirmation', () => ({
  Confirmation: () => <div data-testid="Confirmation" />,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import AlertCandidatesPage from '@/src/pages/backoffice/alerte-candidats/[alertId]';
import CompanyViewPage from '@/src/pages/backoffice/companies/[companyId]';
import CompanyCollaboratorsPage from '@/src/pages/backoffice/companies/[companyId]/collaborators';
import CompanyParametresPage from '@/src/pages/backoffice/companies/parametres';
import PageEvent from '@/src/pages/backoffice/events/[eventId]';
import PageProfile from '@/src/pages/backoffice/profile/[userId]';
import Orienter from '@/src/pages/backoffice/referer/orienter/[step]';
import InscriptionConfirmation from '@/src/pages/backoffice/referer/orienter/confirmation';

const mockUseRouter = useRouter as jest.Mock;
const title = () => screen.getByTestId('layout').getAttribute('data-title');

describe('backoffice data pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockSelectorValues).forEach(
      (k) => delete mockSelectorValues[k]
    );
    mockSelectedCompany.value = null;
    mockCompanyCollab.value = {};
    mockSelectedEvent.value = null;
    mockSelectedProfile.value = null;
    mockCurrentUserCompany.value = null;
    mockReferingRedirection.isLoading = false;
    mockConfirmationRedirection.isLoading = false;
  });

  describe('company page', () => {
    it('shows a loading screen while the company is missing', () => {
      render(<CompanyViewPage />);

      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
      expect(title()).toBe('');
    });

    it('shows a loading screen while the company is being refetched', () => {
      mockSelectedCompany.value = { name: 'Acme' };
      mockSelectorValues.companyRequested = true;
      render(<CompanyViewPage />);

      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
      expect(title()).toBe('Acme');
    });

    it('renders the company profile once loaded', () => {
      mockSelectedCompany.value = { name: 'Acme' };
      mockSelectorValues.companyRequested = false;
      render(<CompanyViewPage />);

      expect(screen.getByTestId('CompanyProfile')).toBeTruthy();
    });
  });

  describe('company collaborators page', () => {
    it('requests the collaborators when a company id is known', () => {
      mockCompanyCollab.value = {
        companyId: 'c1',
        isFetchCompanyWithCollaboratorsRequested: true,
        selectedCompanyWithCollaborators: null,
      };
      render(<CompanyCollaboratorsPage />);

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'fetchCollab' });
      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    });

    it('does not request anything without a company id', () => {
      render(<CompanyCollaboratorsPage />);

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('renders the list once collaborators are loaded', () => {
      mockCompanyCollab.value = {
        companyId: 'c1',
        isFetchCompanyWithCollaboratorsRequested: false,
        selectedCompanyWithCollaborators: { name: 'Acme' },
      };
      render(<CompanyCollaboratorsPage />);

      expect(screen.getByTestId('Collaborators').textContent).toBe('Acme');
      expect(title()).toBe('Gestion de vos collaborateurs');
    });
  });

  describe('company parameters page', () => {
    it('shows a loading screen without company', () => {
      render(<CompanyParametresPage />);

      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    });

    it('renders the parameters of the current user company', () => {
      mockCurrentUserCompany.value = { name: 'Acme' };
      render(<CompanyParametresPage />);

      expect(screen.getByTestId('CompanyParameters').textContent).toBe('Acme');
    });
  });

  describe('event page', () => {
    it('shows a loading title and screen while the event is missing', () => {
      render(<PageEvent />);

      expect(title()).toBe('Événement - Chargement...');
      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    });

    it('renders the event with its name in the title', () => {
      mockSelectedEvent.value = { name: 'Atelier CV' };
      render(<PageEvent />);

      expect(title()).toBe('Événement - Atelier CV');
      expect(screen.getByTestId('Event')).toBeTruthy();
    });

    it('keeps the loading screen while the event is being fetched', () => {
      mockSelectedEvent.value = { name: 'Atelier CV' };
      mockSelectorValues.eventRequested = true;
      render(<PageEvent />);

      expect(screen.queryByTestId('Event')).toBeNull();
    });
  });

  describe('profile page', () => {
    it('uses a generic title and loading screen without profile', () => {
      render(<PageProfile />);

      expect(title()).toBe('Profil');
      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    });

    it('renders the profile with the person name in the title', () => {
      mockSelectedProfile.value = { firstName: 'Ada', lastName: 'Lovelace' };
      render(<PageProfile />);

      expect(title()).toBe('Profil de Ada Lovelace');
      expect(screen.getByTestId('Profile')).toBeTruthy();
    });

    it('keeps the loading screen while the profile is being fetched', () => {
      mockSelectedProfile.value = { firstName: 'Ada', lastName: 'Lovelace' };
      mockSelectorValues.profileRequested = true;
      render(<PageProfile />);

      expect(screen.queryByTestId('Profile')).toBeNull();
    });
  });

  describe('alert candidates page', () => {
    it('renders nothing without an alert id', () => {
      mockUseRouter.mockReturnValue({ query: {}, push: jest.fn() });
      mockSelectorValues.currentUser = { id: 'u' };
      const { container } = render(<AlertCandidatesPage />);

      expect(container.innerHTML).toBe('');
    });

    it('redirects an anonymous visitor to the login page', () => {
      const push = jest.fn();
      mockUseRouter.mockReturnValue({ query: { alertId: 'a1' }, push });
      mockSelectorValues.currentUser = null;
      const { container } = render(<AlertCandidatesPage />);

      expect(push).toHaveBeenCalledWith('/login');
      expect(container.innerHTML).toBe('');
    });

    it('does not redirect when the alert id is not a string', () => {
      const push = jest.fn();
      mockUseRouter.mockReturnValue({ query: { alertId: ['a', 'b'] }, push });
      mockSelectorValues.currentUser = null;
      render(<AlertCandidatesPage />);

      expect(push).not.toHaveBeenCalled();
    });

    it('renders the candidates of the alert for a logged in user', () => {
      const push = jest.fn();
      mockUseRouter.mockReturnValue({ query: { alertId: 'a1' }, push });
      mockSelectorValues.currentUser = { id: 'u' };
      render(<AlertCandidatesPage />);

      expect(screen.getByTestId('AlertCandidates').textContent).toBe('a1');
      expect(title()).toBe('Candidats correspondants');
      expect(push).not.toHaveBeenCalled();
    });
  });

  describe('referer pages', () => {
    it('orienter page shows a loading screen while redirecting', () => {
      mockReferingRedirection.isLoading = true;
      render(<Orienter />);

      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
      expect(screen.queryByTestId('Refering')).toBeNull();
    });

    it('orienter page renders the refering flow once ready', () => {
      render(<Orienter />);

      expect(screen.getByTestId('Refering')).toBeTruthy();
      expect(title()).toBe('Orienter un candidat');
    });

    it('confirmation page shows a loading screen while redirecting', () => {
      mockConfirmationRedirection.isLoading = true;
      render(<InscriptionConfirmation />);

      expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    });

    it('confirmation page renders the confirmation once ready', () => {
      render(<InscriptionConfirmation />);

      expect(screen.getByTestId('Confirmation')).toBeTruthy();
    });
  });
});
