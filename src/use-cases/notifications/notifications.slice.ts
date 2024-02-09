import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceRootState } from 'src/store/utils';
import { displayNotificationAdapter } from "./notifications.adapters";



export interface State {
    displayNotification: ReturnType<typeof displayNotificationAdapter.getInitialState>;
    notifications: {
        id: string;
        type: 'danger' | 'success';
        message: string;
    }[];
}

const initialState: State = {
    displayNotification: displayNotificationAdapter.getInitialState(),
    notifications: [],
};


export const slice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        ...displayNotificationAdapter.getReducers<State>((state) => state.displayNotification),
        addNotification(state, action: PayloadAction<{ id: string; type: 'danger' | 'success'; message: string; }>) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action: PayloadAction<{id: string}>) {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload.id
            );
        },
    }
})

export type RootState = SliceRootState<typeof slice>;
