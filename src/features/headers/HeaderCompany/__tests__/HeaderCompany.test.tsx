import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { companyActions } from '@/src/use-cases/company';
import { currentUserActions } from '@/src/use-cases/current-user';
import { HeaderCompany } from '../HeaderCompany';
import { useHeaderCompany } from '../useHeaderCompany';

jest.mock('@/src/api');
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock(
  '@/src/features/backoffice/companies/modals/CompanyInfosModalEdit',
  () => ({ CompanyInfosModalEdit: () => null })
);
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back-link</span>,
}));
const mockIsMobile = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => !mockIsMobile(),
  useIsMobile: () => mockIsMobile(),
}));

describe('HeaderCompany', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsMobile.mockReturnValue(false);
  });

  it('shows the name, partner tag, sectors and department', () => {
    renderWithProviders(
      <HeaderCompany
        id="c1"
        name="Acme"
        businessSectors={
          [
            { id: '1', name: 'Tech' },
            { id: '2', name: 'BTP' },
          ] as never
        }
        department={{ id: 'd', name: 'Paris' } as never}
      />
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Entreprise partenaire')).toBeInTheDocument();
    expect(screen.getByText(/Tech, BTP\s+-\s+Paris/)).toBeInTheDocument();
    expect(screen.getByText('back-link')).toBeInTheDocument();
  });

  it('omits the separator without sectors', () => {
    renderWithProviders(
      <HeaderCompany
        id="c1"
        name="Acme"
        department={{ id: 'd', name: 'Paris' } as never}
      />
    );
    expect(screen.queryByText(/ - /)).not.toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  it('has no edit button unless editable', () => {
    renderWithProviders(<HeaderCompany id="c1" name="Acme" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('opens the edit modal for editable companies, also on mobile', () => {
    mockIsMobile.mockReturnValue(true);
    renderWithProviders(<HeaderCompany id="c1" name="Acme" isEditable />);
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('wires the edit modal submission to the company update', () => {
    renderWithProviders(<HeaderCompany id="c1" name="Acme" isEditable />);
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    const modal = (openModal as jest.Mock).mock.calls[0][0];
    modal.props.dispatchOnSubmit({ departmentId: { value: 'd1' } });
    expect(Api.updateCompany).toHaveBeenCalledWith({
      departmentId: 'd1',
      businessSectorIds: undefined,
    });
  });
});

describe('useHeaderCompany', () => {
  beforeEach(() => jest.clearAllMocks());

  const setup = () => {
    const store = createTestStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    const { result } = renderHook(() => useHeaderCompany('c1'), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    return { result, dispatch };
  };

  it('updates the company and refreshes the current user', () => {
    const { result, dispatch } = setup();
    result.current.updateCompany({
      departmentId: { value: 'd1' },
      businessSectorIds: [{ value: 's1' }, { value: 's2' }],
    });
    expect(Api.updateCompany).toHaveBeenCalledWith({
      departmentId: 'd1',
      businessSectorIds: ['s1', 's2'],
    });
    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.fetchUserRequested()
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: companyActions.updateCompanyLogoRequested.type,
      })
    );
  });

  it('also uploads the logo when one is provided', () => {
    const { result, dispatch } = setup();
    const logoFile = new File(['x'], 'logo.png');
    result.current.updateCompany({ logo: [logoFile] });
    expect(dispatch).toHaveBeenCalledWith(
      companyActions.updateCompanyLogoRequested({ companyId: 'c1', logoFile })
    );
  });

  it('skips the logo upload for an empty logo list', () => {
    const { result, dispatch } = setup();
    result.current.updateCompany({ logo: [] });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: companyActions.updateCompanyLogoRequested.type,
      })
    );
  });
});
