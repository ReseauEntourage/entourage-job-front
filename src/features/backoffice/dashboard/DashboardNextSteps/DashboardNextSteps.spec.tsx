import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CompanyGoal } from '@/src/constants/company';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { DashboardNextSteps } from './DashboardNextSteps';
import { stepsByContext } from './DashboardNextSteps.config';
import { Context } from './DashboardNextSteps.types';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal',
  () => ({
    CompanyInviteCollaboratorsModal: ({ companyId }: { companyId: string }) => (
      <div>invite-modal-{companyId}</div>
    ),
  })
);
jest.mock(
  '../CompanyRecruitementAlertCard/CompanyRecruitementAlertModal',
  () => ({
    CompanyRecruitementAlertModal: () => <div>alert-modal</div>,
  })
);

const mockUser = useAuthenticatedUser as jest.Mock;
const mockCompany = useCurrentUserCompany as jest.Mock;

describe('DashboardNextSteps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCompany.mockReturnValue(undefined);
  });

  it('renders nothing without user', () => {
    mockUser.mockReturnValue(null);
    const { container } = render(<DashboardNextSteps />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for roles without next steps (admin, referer)', () => {
    mockUser.mockReturnValue({ role: UserRoles.ADMIN });
    const { container, rerender } = render(<DashboardNextSteps />);
    expect(container).toBeEmptyDOMElement();
    mockUser.mockReturnValue({ role: UserRoles.REFERER });
    rerender(<DashboardNextSteps />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the candidate steps, pointing at coaches', () => {
    mockUser.mockReturnValue({ role: UserRoles.CANDIDATE });
    render(<DashboardNextSteps />);
    expect(screen.getByText('Pour aller plus loin')).toBeInTheDocument();
    expect(screen.getByText('Participer à une rencontre')).toBeInTheDocument();
    expect(
      screen.getByText('Retrouvez tous les coachs de la communauté')
    ).toBeInTheDocument();
    expect(screen.getByText('Contacter un coach')).toBeInTheDocument();
    expect(screen.getByText('Avoir la bonne posture')).toBeInTheDocument();
  });

  it('shows the coach steps, pointing at candidates', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockCompany.mockReturnValue({ companyUser: { isAdmin: false } });
    render(<DashboardNextSteps />);
    expect(screen.getByText('Contacter un candidat')).toBeInTheDocument();
    expect(screen.queryByText('Contacter un coach')).not.toBeInTheDocument();
    expect(screen.queryByText('Inviter mes collaborateurs')).toBeNull();
  });

  it('shows the company admin TBS steps and opens the invite modal', () => {
    mockUser.mockReturnValue({
      role: UserRoles.COACH,
      company: { id: 'company-1' },
    });
    mockCompany.mockReturnValue({
      goal: CompanyGoal.SENSIBILIZE,
      companyUser: { isAdmin: true },
    });
    render(<DashboardNextSteps />);
    expect(
      screen.getByText('Compléter ma page entreprise')
    ).toBeInTheDocument();
    expect(screen.queryByText('Créer une alerte')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Inviter'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('shows the recruitment steps for a recruiting company admin and opens the alert modal', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockCompany.mockReturnValue({
      goal: CompanyGoal.RECRUIT,
      companyUser: { isAdmin: true },
    });
    render(<DashboardNextSteps />);
    expect(screen.queryByText('Inviter mes collaborateurs')).toBeNull();
    fireEvent.click(
      screen.getByText('Créer une alerte', { selector: 'button *, button' })
    );
    expect(openModal).toHaveBeenCalledTimes(1);
  });
});

describe('stepsByContext config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defines three steps for each context', () => {
    Object.values(Context).forEach((context) => {
      expect(stepsByContext[context]).toHaveLength(3);
    });
  });

  it('does not open the invite modal without a company', () => {
    const invite = stepsByContext[Context.COMPANY_ADMIN_TBS_MODE][1];
    invite.cta.onClick?.({ company: null } as any);
    invite.cta.onClick?.(undefined);
    expect(openModal).not.toHaveBeenCalled();
  });

  it('opens the invite modal with the user company id', () => {
    const invite = stepsByContext[Context.COMPANY_ADMIN_TBS_MODE][1];
    invite.cta.onClick?.({ company: { id: 'c-1' } } as any);
    expect(openModal).toHaveBeenCalledTimes(1);
  });
});
