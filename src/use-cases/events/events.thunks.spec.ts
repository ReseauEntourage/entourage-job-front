jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { updateUserParticipationThunk } from './events.thunks';

const mockedApi = getMockedApi();

describe('events thunks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserParticipationThunk', () => {
    it('fulfills with the API response payload on success', async () => {
      const store = createTestStore();
      const data = { isParticipating: true };
      mockedApi.updateEventParticipation.mockResolvedValue({ data } as any);

      const resultAction = await store.dispatch(
        updateUserParticipationThunk({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        }) as any
      );

      expect(resultAction.type).toBe(
        'events/updateUserParticipation/fulfilled'
      );
      expect(resultAction.payload).toEqual(data);
      expect(mockedApi.updateEventParticipation).toHaveBeenCalledWith(
        'event-1',
        true
      );
    });

    it('rejects with the error message when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockRejectedValue(
        new Error('network error')
      );

      const resultAction = await store.dispatch(
        updateUserParticipationThunk({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        }) as any
      );

      expect(resultAction.type).toBe('events/updateUserParticipation/rejected');
      expect(resultAction.payload).toBe('network error');
    });

    it('rejects with a fallback message when the error has no message', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockRejectedValue({});

      const resultAction = await store.dispatch(
        updateUserParticipationThunk({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        }) as any
      );

      expect(resultAction.type).toBe('events/updateUserParticipation/rejected');
      expect(resultAction.payload).toBe('Erreur inconnue');
    });
  });
});
