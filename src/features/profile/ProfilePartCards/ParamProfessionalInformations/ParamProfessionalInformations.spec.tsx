import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { ParamProfessionalInformations } from './ParamProfessionalInformations';

let mockRole: UserRoles = UserRoles.COACH;

jest.mock('@/src/components/ui', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));
jest.mock('@/src/components/ui/Headings', () => ({
  H6: ({ title }: { title: string }) => <h6>{title}</h6>,
}));
jest.mock('@/src/components/ui/SvgIcon/SvgIcon', () => ({
  SvgIcon: () => null,
}));
jest.mock(
  '@/src/features/backoffice/parameters/ProfessionalInformationCard/ModalEditProfessionalInformation',
  () => ({ ModalEditProfessionalInformation: () => null })
);
jest.mock(
  '@/src/features/backoffice/parameters/ProfessionalInformationCard/ProfessionalInformationCard.utils',
  () => ({
    getCandidateDefaultProfessionalValues: jest.fn(),
    getCoachDefaultProfessionalValues: jest.fn(),
  })
);
jest.mock(
  '@/src/features/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence',
  () => ({ ProfileCareerPathSentence: () => null })
);
jest.mock(
  '@/src/features/forms/schemas/formEditCandidateProfessionalInformation',
  () => ({
    formEditCandidateProfessionalInformation: {},
  })
);
jest.mock(
  '@/src/features/forms/schemas/formEditCoachProfessionalInformation',
  () => ({
    formEditCoachProfessionalInformation: {},
  })
);
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'user-id', role: mockRole }),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: () => null,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => ({ currentJob: null }),
}));
jest.mock('@/src/utils', () => ({ formatCareerPathSentence: jest.fn() }));
jest.mock('../Card/Card/Card', () => ({
  ProfilePartCard: ({
    ctaCallback,
    fallback,
  }: {
    ctaCallback: () => void;
    fallback: { content: React.ReactNode };
  }) => (
    <div>
      <button type="button" onClick={ctaCallback}>
        edit
      </button>
      {fallback.content}
    </div>
  ),
}));

const openEditModal = (role: UserRoles) => {
  mockRole = role;
  (openModal as jest.Mock).mockClear();
  render(<ParamProfessionalInformations sectorOccupations={[]} isEditable />);
  fireEvent.click(screen.getByText('edit'));
  return (openModal as jest.Mock).mock.calls[0][0].props.title as string;
};

describe('ParamProfessionalInformations', () => {
  [UserRoles.COACH, UserRoles.ADMIN].forEach((role) => {
    it(`opens the coach form for ${role}`, () => {
      expect(openEditModal(role)).toMatch(
        /secteurs dans lesquels vous avez du réseau/
      );
    });
  });

  it('opens the candidate form for a candidate', () => {
    expect(openEditModal(UserRoles.CANDIDATE)).toMatch(/projet professionnel/);
  });
});
