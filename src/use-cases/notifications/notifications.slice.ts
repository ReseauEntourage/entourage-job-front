import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceRootState } from 'src/store/utils';
import { v4 as uuid } from 'uuid';



export interface State {
    notifications: {
        id: string;
        type: 'danger' | 'success';
        message: string;
    }[];
}

const initialState: State = {
    notifications: [],
};


export const slice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<{ type: 'danger' | 'success'; message: string; }>) {
            const id =  uuid();
            state.notifications.push({id, ...action.payload});
        },
        removeNotification(state, action: PayloadAction<{id: string}>) {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload.id
            );
        },
    }
})

export type RootState = SliceRootState<typeof slice>;
