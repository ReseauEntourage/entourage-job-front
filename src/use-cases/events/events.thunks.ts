import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '@/src/api';

export const updateUserParticipationThunk = createAsyncThunk(
  'events/updateUserParticipation',
  async (
    params: { eventSalesForceId: string; isParticipating: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await Api.updateEventParticipation(
        params.eventSalesForceId,
        params.isParticipating
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Erreur inconnue');
    }
  }
);
