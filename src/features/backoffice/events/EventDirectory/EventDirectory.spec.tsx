import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';
import { EventDirectory } from './EventDirectory';
import { useEventDirectoryQueryParams } from './useEventDirectoryQueryParams';

jest.mock('@/src/api');
let mockMobile = false;
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: () => mockMobile,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('./useEventDirectoryQueryParams', () => ({
  useEventDirectoryQueryParams: jest.fn(),
}));
const mockSetFilters = jest.fn();
const mockSetSearch = jest.fn();
const mockResetFilters = jest.fn();
jest.mock('@/src/hooks', () => ({
  useFilters: () => ({
    setFilters: mockSetFilters,
    setSearch: mockSetSearch,
    resetFilters: mockResetFilters,
  }),
}));
jest.mock('@/src/features/headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title }: any) => <h1>{title}</h1>,
}));
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: ({
    filters,
    filtersConstants,
    resetFilters,
    additionalButtons,
  }: any) => (
    <div>
      <span data-testid="filters">{JSON.stringify(filters)}</span>
      <span data-testid="constants">
        {filtersConstants.map((f: any) => f.key).join(',')}
      </span>
      <button onClick={resetFilters}>reset</button>
      {additionalButtons}
    </div>
  ),
}));
jest.mock('@/src/features/filters/MobileFilters', () => ({
  MobileFilterButton: ({ count, onClick }: any) => (
    <button onClick={onClick}>{`mobile-filters-${count}`}</button>
  ),
  MobileFilterDrawer: ({ isOpen, onClose }: any) =>
    isOpen ? <button onClick={onClose}>drawer-open</button> : null,
}));
jest.mock('../EventDirectoryList/EventDirectoryList', () => ({
  EventDirectoryList: () => <div data-testid="list" />,
}));

const departments = [
  { id: 'd1', name: 'Paris', value: '75' },
  { id: 'd2', name: 'Rhône', value: '69' },
];

const setup = (query: Record<string, unknown> = {}, profile: any = null) => {
  (useEventDirectoryQueryParams as jest.Mock).mockReturnValue({
    modes: [],
    eventTypes: [],
    departmentIds: [],
    publicSensibilise: [],
    ...query,
  });
  (useCurrentUserProfile as jest.Mock).mockReturnValue(profile);
  return renderWithProviders(<EventDirectory />);
};

describe('EventDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMobile = false;
    (Api.getAllDepartments as jest.Mock).mockResolvedValue({
      data: departments,
    });
  });

  it('shows the header, the four filters and the list', async () => {
    setup();

    expect(
      screen.getByText('Découvrez tous les événements')
    ).toBeInTheDocument();
    expect(screen.getByTestId('constants')).toHaveTextContent(
      'modes,eventTypes,departmentIds,publicSensibilise'
    );
    expect(screen.getByTestId('list')).toBeInTheDocument();
    await waitFor(() =>
      expect(Api.getAllDepartments).toHaveBeenCalledWith({ search: '' })
    );
  });

  it('notifies an error when departments cannot be loaded', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    (Api.getAllDepartments as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = setup();

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'danger',
          message:
            "Une erreur s'est produite lors du chargement des départements",
        }),
      ])
    );
  });

  it('pre-selects the department of the user profile when no department is in the URL', async () => {
    setup({}, { department: 'Paris (75)' });

    await waitFor(() =>
      expect(mockSetFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          departmentIds: [{ label: 'Paris (75)', value: 'd1' }],
        })
      )
    );
  });

  it('pre-selects nothing when the profile department is not in the list', async () => {
    setup({}, { department: 'Unknown' });

    await waitFor(() =>
      expect(mockSetFilters).toHaveBeenCalledWith(
        expect.objectContaining({ departmentIds: [] })
      )
    );
  });

  it('keeps the department chosen in the URL instead of the profile default', async () => {
    setup({ departmentIds: ['d2'] }, { department: 'Paris (75)' });

    await waitFor(() =>
      expect(screen.getByTestId('filters')).toHaveTextContent('Rhône (69)')
    );
    expect(mockSetFilters).not.toHaveBeenCalled();
  });

  it('does not set a default department without profile department', async () => {
    setup({}, { department: null });

    await waitFor(() => expect(Api.getAllDepartments).toHaveBeenCalled());
    expect(mockSetFilters).not.toHaveBeenCalled();
  });

  it('resolves the URL filters into their constants', () => {
    setup({ modes: ['online'], eventTypes: ['WORKSHOP'] });

    const filters = JSON.parse(
      screen.getByTestId('filters').textContent ?? '{}'
    );
    expect(filters.modes).toEqual([{ value: 'online', label: 'En ligne' }]);
    expect(filters.eventTypes).toEqual([
      expect.objectContaining({ value: 'WORKSHOP' }),
    ]);
  });

  it('resets the filters through the search bar', () => {
    setup();
    fireEvent.click(screen.getByText('reset'));

    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it('does not show the mobile filters on desktop', () => {
    setup();

    expect(screen.queryByText(/mobile-filters/)).not.toBeInTheDocument();
  });

  it('opens and closes the mobile filter drawer, counting the applied filters', () => {
    mockMobile = true;
    setup({ modes: ['online'], eventTypes: ['WORKSHOP'] });

    expect(screen.getByText('mobile-filters-2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('mobile-filters-2'));
    fireEvent.click(screen.getByText('drawer-open'));

    expect(screen.queryByText('drawer-open')).not.toBeInTheDocument();
  });
});
