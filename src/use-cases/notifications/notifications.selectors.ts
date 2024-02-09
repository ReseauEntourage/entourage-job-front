import { RootState } from './notifications.slice';


export const selectNotifications = (state: RootState) => state.notifications.notifications;