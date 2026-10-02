import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupAdminItem } from '@/src/api/types';
import { ModalContext } from '@/src/features/modals/Modal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { DeleteHelpGroupModal, EditHelpGroupModal } from '../HelpGroupModals';

const mockCreateHelpGroup = jest.fn();
const mockDeleteHelpGroup = jest.fn();

jest.mock('@/src/use-cases/help-groups', () => ({
  useCreateHelpGroupMutation: () => [mockCreateHelpGroup, {}],
  useUpdateHelpGroupMutation: () => [jest.fn(), {}],
  useDeleteHelpGroupMutation: () => [mockDeleteHelpGroup, { isLoading: false }],
}));

// react-modal scrolls its content on open, which jsdom does not implement
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const group: HelpGroupAdminItem = {
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Description',
  charter: 'Cadre',
  publishedAt: '2026-09-01T10:00:00.000Z',
  pinnedAt: null,
  createdAt: '2026-09-01T10:00:00.000Z',
  deletedAt: null,
  membersCount: 3,
  discussionsCount: 1,
  lastActivityAt: null,
};

const renderInModal = (ui: React.ReactElement, onClose = jest.fn()) => {
  renderWithProviders(
    <ModalContext.Provider value={{ onClose }}>{ui}</ModalContext.Provider>
  );
  return onClose;
};

const fill = (id: string, value: string) =>
  fireEvent.change(screen.getByTestId(id), { target: { value } });

// Form fields ids are prefixed with the form id
const fillField = (field: string, value: string) =>
  fill(`form-help-group-${field}`, value);

describe('EditHelpGroupModal', () => {
  beforeEach(() => {
    mockCreateHelpGroup.mockReset();
    mockCreateHelpGroup.mockResolvedValue({ data: undefined });
  });

  it('shows the characters counters', () => {
    renderInModal(<EditHelpGroupModal />);
    expect(screen.getByText(/80 caractère\(s\) restant\(s\)/)).toBeVisible();
    expect(screen.getByText(/500 caractère\(s\) restant\(s\)/)).toBeVisible();
    expect(screen.getByText(/5000 caractère\(s\) restant\(s\)/)).toBeVisible();
  });

  [
    ['name', 81, 80],
    ['description', 501, 500],
    ['charter', 5001, 5000],
  ].forEach(([field, length, max]) => {
    it(`refuses a ${field} longer than ${max} characters`, async () => {
      renderInModal(<EditHelpGroupModal />);
      fillField('name', 'Refaire un CV');
      fillField('description', 'Description');
      fillField('charter', 'Cadre');
      fillField(field as string, 'a'.repeat(length as number));
      fireEvent.click(screen.getByText('Créer le groupe'));

      expect(
        await screen.findByText(`${max} caractères maximum`)
      ).toBeInTheDocument();
      expect(mockCreateHelpGroup).not.toHaveBeenCalled();
    });
  });

  it('creates a valid group and closes the modal', async () => {
    const onClose = renderInModal(<EditHelpGroupModal />);
    fillField('name', 'a'.repeat(80));
    fillField('description', 'Description');
    fillField('charter', 'Cadre');
    fireEvent.click(screen.getByText('Créer le groupe'));

    await waitFor(() =>
      expect(mockCreateHelpGroup).toHaveBeenCalledWith({
        name: 'a'.repeat(80),
        description: 'Description',
        charter: 'Cadre',
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});

describe('DeleteHelpGroupModal', () => {
  beforeEach(() => {
    mockDeleteHelpGroup.mockReset();
    mockDeleteHelpGroup.mockResolvedValue({ data: undefined });
  });

  it('states what disappears', () => {
    renderInModal(<DeleteHelpGroupModal group={group} />);
    expect(
      screen.getByText(
        /ne seront plus visibles par personne, y compris par leurs auteurs/
      )
    ).toBeInTheDocument();
  });

  it('keeps the button disabled until the exact group name is typed', async () => {
    const onClose = renderInModal(<DeleteHelpGroupModal group={group} />);
    const confirm = screen.getByTestId('delete-help-group-confirm');
    expect(confirm).toBeDisabled();

    fill('delete-help-group-name', 'refaire un cv');
    expect(confirm).toBeDisabled();
    fireEvent.click(confirm);
    expect(mockDeleteHelpGroup).not.toHaveBeenCalled();

    fill('delete-help-group-name', 'Refaire un CV ');
    expect(confirm).toBeDisabled();

    fill('delete-help-group-name', 'Refaire un CV');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    await waitFor(() =>
      expect(mockDeleteHelpGroup).toHaveBeenCalledWith('group-1')
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not delete when cancelled', () => {
    const onClose = renderInModal(<DeleteHelpGroupModal group={group} />);
    fireEvent.click(screen.getByTestId('delete-help-group-cancel'));
    expect(onClose).toHaveBeenCalled();
    expect(mockDeleteHelpGroup).not.toHaveBeenCalled();
  });
});
