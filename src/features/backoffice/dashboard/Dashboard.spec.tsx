import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CompanyGoal } from '@/src/constants/company';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { Dashboard } from './Dashboard';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));

// Every card is stubbed by a labelled placeholder: this spec only checks which
// cards a given profile sees, and in which order.
// A function declaration is hoisted above the (hoisted) jest.mock factories.
function mockStub(name: string) {
  return () => <div data-testid="card">{name}</div>;
}
jest.mock('../StaffContactCard', () => ({
  StaffContactCard: mockStub('staff'),
}));
jest.mock(
  '../referer/dashboard/DashboardInviteToReferCandidate/DashboardInviteToReferCandidate',
  () => ({ DashboardInviteToReferCandidate: mockStub('invite-refer') })
);
jest.mock(
  '../referer/dashboard/DashboardReferedCandidateList/DashboardReferedCandidateList',
  () => ({ DashboardReferedCandidateList: mockStub('refered-list') })
);
jest.mock('./CompanyRecruitementAlertCard', () => ({
  CompanyRecruitementAlertCard: mockStub('recruitement-alert'),
}));
jest.mock(
  './DashboardAchievementProgression/DashboardAchievementProgression',
  () => ({ DashboardAchievementProgression: mockStub('achievements') })
);
jest.mock('./DashboardAlertWhatsapp/DashboardAlertWhatsapp', () => ({
  DashboardAlertWhatsapp: mockStub('whatsapp'),
}));
jest.mock('./DashboardCompanyCard/DashboardCompanyCard', () => ({
  DashboardCompanyCard: mockStub('company-card'),
}));
jest.mock(
  './DashboardCompanyCollaboratorsList/DashboardCompanyCollaboratorsList',
  () => ({ DashboardCompanyCollaboratorsList: mockStub('collaborators') })
);
jest.mock('./DashboardElearningNudge/DashboardElearningNudge', () => ({
  DashboardElearningNudge: mockStub('elearning-nudge'),
}));
jest.mock('./DashboardMessagingConversation', () => ({
  DashboardMessagingConversation: mockStub('messaging'),
}));
jest.mock('./DashboardNextSteps/DashboardNextSteps', () => ({
  DashboardNextSteps: mockStub('next-steps'),
}));
jest.mock('./DashboardProfileCard', () => ({
  DashboardProfileCard: mockStub('profile'),
}));
jest.mock('./DashboardRecommendationsCard', () => ({
  DashboardRecommendationsCard: mockStub('recommendations'),
}));
jest.mock('./DashboardToolboxCard', () => ({
  DashboardToolboxCard: mockStub('toolbox'),
}));

const cards = () => screen.getAllByTestId('card').map((el) => el.textContent);

const setup = (
  user: Record<string, unknown>,
  company: Record<string, unknown> | null = null
) => {
  (useAuthenticatedUser as jest.Mock).mockReturnValue(user);
  (useCurrentUserCompany as jest.Mock).mockReturnValue(company);
  return render(<Dashboard />);
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockDesktop = true;
  });

  it('greets the user', () => {
    setup({ role: UserRoles.CANDIDATE });
    expect(
      screen.getByText('Bienvenue sur votre tableau de bord')
    ).toBeInTheDocument();
  });

  it('shows a candidate the whatsapp alert, the nudge and the recommendations', () => {
    setup({ role: UserRoles.CANDIDATE });
    expect(cards()).toEqual([
      'whatsapp',
      'profile',
      'staff',
      'elearning-nudge',
      'recommendations',
      'next-steps',
      'messaging',
      'toolbox',
    ]);
  });

  it('shows a coach who did not finish the training the nudge', () => {
    setup({ role: UserRoles.COACH });
    expect(cards()).toContain('elearning-nudge');
    expect(cards()).not.toContain('achievements');
  });

  it('shows a coach who finished the training their achievements, not the nudge', () => {
    setup({ role: UserRoles.COACH, elearningCompletedAt: '2026-01-01' });
    expect(cards()).toContain('achievements');
    expect(cards()).not.toContain('elearning-nudge');
  });

  it('shows a coach with a company the company card after the profile', () => {
    setup(
      { role: UserRoles.COACH },
      { id: 'c1', companyUser: { isAdmin: false } }
    );
    const list = cards();
    expect(list.indexOf('profile')).toBeLessThan(list.indexOf('company-card'));
    expect(list).not.toContain('collaborators');
    expect(list).not.toContain('recruitement-alert');
    expect(list).toContain('whatsapp');
  });

  it('puts the company card first for a company admin, without whatsapp nor nudge', () => {
    setup(
      { role: UserRoles.COACH },
      {
        id: 'c1',
        goal: CompanyGoal.SENSIBILIZE,
        companyUser: { isAdmin: true },
      }
    );
    expect(cards()).toEqual([
      'company-card',
      'profile',
      'staff',
      'next-steps',
      'collaborators',
      'recruitement-alert',
      'messaging',
      'recommendations',
      'toolbox',
    ]);
  });

  it('reorders the cards of a company admin with a recruitment goal', () => {
    setup(
      { role: UserRoles.COACH },
      { id: 'c1', goal: CompanyGoal.RECRUIT, companyUser: { isAdmin: true } }
    );
    expect(cards()).toEqual([
      'company-card',
      'profile',
      'staff',
      'next-steps',
      'recruitement-alert',
      'recommendations',
      'collaborators',
      'messaging',
      'toolbox',
    ]);
  });

  it('shows a referer their refering cards only', () => {
    setup({ role: UserRoles.REFERER });
    expect(cards()).toEqual([
      'profile',
      'staff',
      'elearning-nudge',
      'messaging',
      'invite-refer',
      'refered-list',
      'toolbox',
    ]);
  });

  it('shows an admin neither next steps nor recommendations nor whatsapp', () => {
    setup({ role: UserRoles.ADMIN });
    const list = cards();
    ['next-steps', 'recommendations', 'whatsapp', 'invite-refer'].forEach(
      (name) => expect(list).not.toContain(name)
    );
  });

  it('puts the right column first on mobile, and still shows the whatsapp alert to a company admin', () => {
    mockDesktop = false;
    setup(
      { role: UserRoles.COACH },
      {
        id: 'c1',
        goal: CompanyGoal.SENSIBILIZE,
        companyUser: { isAdmin: true },
      }
    );
    const list = cards();
    expect(list[0]).toBe('whatsapp');
    expect(list.indexOf('next-steps')).toBeLessThan(list.indexOf('profile'));
  });
});
