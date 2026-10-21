jest.mock('@/src/api');
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: ({ label }: any) => <a>{label}</a>,
}));
jest.mock('@/src/features/headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title, description }: any) => (
    <header>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  ),
}));
jest.mock('../network-directory/NetworkDirectoryItem', () => ({
  NetworkDirectoryUserItem: (props: any) => (
    <li data-testid="candidate">
      {props.firstName} {props.lastName}|{String(props.isAvailable)}|
      {String(props.hasPicture)}|{props.job ?? 'nojob'}|
      {props.achievements.length}
    </li>
  ),
}));

import { act, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { AlertCandidates } from './AlertCandidates';

const mockedApi = getMockedApi();

const settle = () =>
  act(async () => {
    await flushPromises();
  });

describe('AlertCandidates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it('shows the alert title and the matching candidates', async () => {
    mockedApi.getRecruitementAlerts.mockResolvedValue({
      data: [{ id: 'a1', name: 'Dev web' }],
    } as any);
    mockedApi.getRecruitementAlertMatching.mockResolvedValue({
      data: [
        {
          id: 'p1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          role: 'Candidat',
          unavailableAt: null,
          hasPicture: true,
          currentJob: 'Dev',
          achievements: [{}, {}],
          sectorOccupations: [],
        },
        {
          id: 'p2',
          firstName: 'Alan',
          lastName: 'Turing',
          role: 'Candidat',
          unavailableAt: '2026-01-01',
          currentJob: null,
          achievements: null,
          sectorOccupations: [],
        },
      ],
    } as any);

    renderWithProviders(<AlertCandidates alertId="a1" />);
    await settle();

    expect(mockedApi.getRecruitementAlerts).toHaveBeenCalledTimes(1);
    expect(mockedApi.getRecruitementAlertMatching).toHaveBeenCalledWith('a1');
    expect(
      screen.getByText("Candidats correspondant à l'alerte: Dev web")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Voici les candidats qui correspondent aux critères de votre alerte.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Retour')).toBeInTheDocument();
    const items = screen.getAllByTestId('candidate');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Ada Lovelace|true|true|Dev|2');
    expect(items[1]).toHaveTextContent('Alan Turing|false|false|nojob|0');
  });

  it('shows an empty state when no candidate matches', async () => {
    mockedApi.getRecruitementAlerts.mockResolvedValue({
      data: [{ id: 'a1', name: 'Dev web' }],
    } as any);
    mockedApi.getRecruitementAlertMatching.mockResolvedValue({
      data: [],
    } as any);
    renderWithProviders(<AlertCandidates alertId="a1" />);
    await settle();
    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
  });

  it('shows "Alerte non trouvée" when the alert does not exist', async () => {
    mockedApi.getRecruitementAlerts.mockResolvedValue({ data: [] } as any);
    mockedApi.getRecruitementAlertMatching.mockResolvedValue({
      data: [],
    } as any);
    renderWithProviders(<AlertCandidates alertId="missing" />);
    await settle();
    expect(screen.getByText('Alerte non trouvée')).toBeInTheDocument();
  });

  it('does not fetch anything without an alert id', async () => {
    renderWithProviders(<AlertCandidates alertId="" />);
    await settle();
    expect(mockedApi.getRecruitementAlerts).not.toHaveBeenCalled();
    expect(mockedApi.getRecruitementAlertMatching).not.toHaveBeenCalled();
    expect(screen.getByText('Alerte non trouvée')).toBeInTheDocument();
  });

  it('shows a spinner while the data is loading', async () => {
    mockedApi.getRecruitementAlerts.mockReturnValue(new Promise(() => {}));
    mockedApi.getRecruitementAlertMatching.mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(<AlertCandidates alertId="a1" />);
    await settle();
    expect(screen.queryByText('Alerte non trouvée')).toBeNull();
    expect(screen.queryByText('Retour')).toBeNull();
  });
});
