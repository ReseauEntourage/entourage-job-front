jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/components/ui/Inputs/SelectList', () => ({
  SelectList: ({ options, value, isLoading, onChange }: any) => (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="value">{JSON.stringify(value)}</span>
      {options.map((group: any, i: number) => (
        <div key={i} data-testid="group">
          {group.label}
          {group.options.map((o: any) => (
            <button key={o.value} onClick={() => onChange([o.value])}>
              {o.value}
            </button>
          ))}
        </div>
      ))}
      <button onClick={() => onChange([])}>clear</button>
    </div>
  ),
}));
jest.mock(
  '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionWebinarLabel/SelectOptionWebinarLabel',
  () => ({
    SelectOptionWebinarLabel: () => <span />,
  })
);

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
import { EventMode, EventType } from '@/src/constants/events';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { WebinarSelectGroupLabel } from './WebinarSelectGroupLabel';
import { WebinarSelection } from './WebinarSelection';

const mockedApi = getMockedApi();

const event = (salesForceId: string, mode: string) => ({ salesForceId, mode });

async function setup({
  department,
  events = [] as any[],
  webinarSfId = null as string | null,
  onChange = jest.fn(),
}: {
  department?: string | null;
  events?: any[];
  webinarSfId?: string | null;
  onChange?: jest.Mock;
} = {}) {
  (useCurrentUserProfile as jest.Mock).mockReturnValue({ department });
  mockedApi.getAllEvents.mockResolvedValue({ data: events } as any);
  render(<WebinarSelection webinarSfId={webinarSfId} onChange={onChange} />);
  await act(async () => {
    await flushPromises();
  });
  return { onChange };
}

describe('WebinarSelection', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => cleanup());

  it('loads the next welcome and coffee sessions without department filter by default', async () => {
    await setup({ department: null });
    expect(mockedApi.getAllDepartments).not.toHaveBeenCalled();
    expect(mockedApi.getAllEvents).toHaveBeenCalledWith({
      eventTypes: [EventType.WELCOME_SESSION, EventType.COFFEE_SESSION],
      limit: 6,
      offset: 0,
      departmentIds: [],
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('filters the sessions on the department of the user', async () => {
    mockedApi.getAllDepartments.mockResolvedValue({
      data: [{ id: 'dep-75' }],
    } as any);
    await setup({ department: 'Paris (75)' });
    expect(mockedApi.getAllDepartments).toHaveBeenCalledWith({ search: '75' });
    expect(mockedApi.getAllEvents).toHaveBeenCalledWith(
      expect.objectContaining({ departmentIds: ['dep-75'] })
    );
  });

  it('does not filter when the department is unknown', async () => {
    mockedApi.getAllDepartments.mockResolvedValue({ data: [] } as any);
    await setup({ department: 'Paris (75)' });
    expect(mockedApi.getAllEvents).toHaveBeenCalledWith(
      expect.objectContaining({ departmentIds: [] })
    );
  });

  it('groups the sessions by remote and in person', async () => {
    await setup({
      events: [
        event('sf1', EventMode.ONLINE),
        event('sf2', EventMode.IN_PERSON),
        event('sf3', EventMode.ONLINE),
      ],
    });
    const groups = screen.getAllByTestId('group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveTextContent('sf1');
    expect(groups[0]).toHaveTextContent('sf3');
    expect(groups[1]).toHaveTextContent('sf2');
  });

  it('only shows the groups that have sessions', async () => {
    await setup({ events: [event('sf2', EventMode.IN_PERSON)] });
    expect(screen.getAllByTestId('group')).toHaveLength(1);
    cleanup();
    await setup({ events: [] });
    expect(screen.queryAllByTestId('group')).toHaveLength(0);
  });

  it('reports the chosen session, or an empty string when cleared', async () => {
    const { onChange } = await setup({
      events: [event('sf1', EventMode.ONLINE)],
      webinarSfId: 'sf1',
    });
    expect(screen.getByTestId('value')).toHaveTextContent('["sf1"]');
    fireEvent.click(screen.getByRole('button', { name: 'sf1' }));
    expect(onChange).toHaveBeenCalledWith('sf1');
    fireEvent.click(screen.getByText('clear'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has no selection without a webinar', async () => {
    await setup({ events: [event('sf1', EventMode.ONLINE)] });
    expect(screen.getByTestId('value')).toHaveTextContent('[]');
  });
});

describe('WebinarSelectGroupLabel', () => {
  afterEach(() => cleanup());

  it('shows the label of the group', () => {
    render(<WebinarSelectGroupLabel icon="Laptop" label="À distance" />);
    expect(screen.getByText('À distance')).toBeInTheDocument();
  });
});
