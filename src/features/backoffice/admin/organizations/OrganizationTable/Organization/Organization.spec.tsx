import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { OrganizationTable } from '../OrganizationTable';
import { EditOrganizationModal } from './EditOrganizationModal';
import { Organization } from './index';

jest.mock('@/src/api');
let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
const mockSubmit = jest.fn();
let mockApiCall: (o: any) => Promise<any>;
jest.mock(
  '@/src/features/backoffice/admin/useOnOrganizationFormSubmit',
  () => ({
    useOnOrganizationFormSubmit: (apiCall: any) => {
      mockApiCall = apiCall;
      return { onSubmit: mockSubmit };
    },
  })
);
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => (
    <div data-testid="modal-edit">
      <span data-testid="defaults">{JSON.stringify(props.defaultValues)}</span>
      <button onClick={() => props.onSubmit({ name: 'New' }, 'close')}>
        submit
      </button>
    </div>
  ),
}));

const organization = {
  id: 'o1',
  name: 'Asso',
  address: '1 rue X',
  zone: 'PARIS',
  referersCount: 4,
  candidatesCount: 7,
  organizationReferent: {
    referentFirstName: 'Jean',
    referentLastName: 'Dupont',
    referentMail: 'jean@asso.fr',
    referentPhone: '0600000000',
  },
} as any;

describe('OrganizationTable', () => {
  it('shows the column headers and the given rows', () => {
    render(
      <OrganizationTable
        organizations={[
          <tr key="a">
            <td>row-a</td>
          </tr>,
        ]}
      />
    );

    [
      'Structure partenaire',
      'Contact',
      'Mail',
      'Téléphone',
      'Zone',
      'Prescripteurs',
      'Candidats',
      'Édition',
    ].forEach((header) => expect(screen.getByText(header)).toBeInTheDocument());
    expect(screen.getByTestId('organization-list')).toHaveTextContent('row-a');
  });
});

[true, false].forEach((desktop) => {
  describe(`Organization row (${desktop ? 'desktop' : 'mobile'})`, () => {
    const refreshOrganizations = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      mockDesktop = desktop;
    });

    const setup = () => {
      const row = (
        <Organization
          organization={organization}
          refreshOrganizations={refreshOrganizations}
        />
      );
      return render(
        desktop ? (
          <table>
            <tbody>{row}</tbody>
          </table>
        ) : (
          row
        )
      );
    };

    it('shows the organization details and the capitalized zone', () => {
      setup();

      expect(screen.getByText('Asso')).toBeInTheDocument();
      expect(screen.getByText('1 rue X')).toBeInTheDocument();
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('jean@asso.fr')).toBeInTheDocument();
      expect(screen.getByText('0600000000')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('opens the edit modal with the organization', () => {
      setup();
      fireEvent.click(screen.getByTestId('button-edit-organization-o1'));

      expect(openModal).toHaveBeenCalledTimes(1);
      const element = (openModal as jest.Mock).mock.calls[0][0];
      expect(element.type).toBe(EditOrganizationModal);
      expect(element.props.organization).toBe(organization);
      expect(element.props.refreshOrganizations).toBe(refreshOrganizations);
    });
  });
});

describe('EditOrganizationModal', () => {
  const refreshOrganizations = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is prefilled with the organization and its referent', () => {
    render(
      <EditOrganizationModal
        organization={organization}
        refreshOrganizations={refreshOrganizations}
      />
    );

    expect(
      JSON.parse(screen.getByTestId('defaults').textContent ?? '')
    ).toEqual(
      expect.objectContaining({
        name: 'Asso',
        referentFirstName: 'Jean',
        referentMail: 'jean@asso.fr',
      })
    );
  });

  it('updates the organization through the API', async () => {
    render(
      <EditOrganizationModal
        organization={organization}
        refreshOrganizations={refreshOrganizations}
      />
    );

    await mockApiCall({ name: 'X' });

    expect(Api.putOrganization).toHaveBeenCalledWith('o1', { name: 'X' });
  });

  it('refreshes the organizations after a successful submission', async () => {
    mockSubmit.mockResolvedValue(undefined);
    render(
      <EditOrganizationModal
        organization={organization}
        refreshOrganizations={refreshOrganizations}
      />
    );
    fireEvent.click(screen.getByText('submit'));

    await waitFor(() => expect(refreshOrganizations).toHaveBeenCalledTimes(1));
    expect(mockSubmit).toHaveBeenCalledWith({ name: 'New' }, 'close');
  });
});
