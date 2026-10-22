jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/components/ui/Inputs/SelectList/SelectList', () => ({
  SelectList: ({ options, value, isLoading, onChange, variant }: any) => (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="variant">{variant}</span>
      <span data-testid="value">{JSON.stringify(value)}</span>
      <ul>
        {options.map((o: any) => (
          <li key={o.value} data-testid="option">
            {o.value}
          </li>
        ))}
      </ul>
      <button onClick={() => onChange(['n2'])}>choose</button>
    </div>
  ),
}));

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { Content } from './Content';

const mockedApi = getMockedApi();

describe('Nudges step Content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it('loads the nudges for the role, then lists them as options', async () => {
    mockedApi.getAllNudges.mockResolvedValue({
      data: [
        {
          id: 'n1',
          nameRequest: 'Aide CV',
          nameOffer: 'Aider CV',
          value: 'cv',
        },
        {
          id: 'n2',
          nameRequest: 'Entretien',
          nameOffer: 'Préparer',
          value: 'interview',
        },
      ],
    } as any);
    render(
      <Content
        userRole={UserRoles.CANDIDATE}
        nudgeIds={['n1']}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    await act(async () => {
      await flushPromises();
    });
    expect(mockedApi.getAllNudges).toHaveBeenCalledWith({
      search: '',
      limit: 50,
      offset: 0,
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('variant')).toHaveTextContent('inline');
    expect(screen.getByTestId('value')).toHaveTextContent('["n1"]');
    expect(screen.getAllByTestId('option')).toHaveLength(2);
    // loaded only once
    expect(mockedApi.getAllNudges).toHaveBeenCalledTimes(1);
  });

  it('forwards the selection', async () => {
    mockedApi.getAllNudges.mockResolvedValue({ data: [] } as any);
    const onChange = jest.fn();
    render(
      <Content userRole={UserRoles.COACH} nudgeIds={[]} onChange={onChange} />
    );
    await act(async () => {
      await flushPromises();
    });
    fireEvent.click(screen.getByText('choose'));
    expect(onChange).toHaveBeenCalledWith(['n2']);
  });

  it('shows an empty list when loading the nudges fails', async () => {
    mockedApi.getAllNudges.mockRejectedValue(new Error('boom'));
    render(
      <Content userRole={UserRoles.COACH} nudgeIds={[]} onChange={jest.fn()} />
    );
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.queryAllByTestId('option')).toHaveLength(0);
  });
});
