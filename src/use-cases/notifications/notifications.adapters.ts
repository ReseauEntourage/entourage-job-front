import { createRequestAdapter } from 'src/store/utils';

export const displayNotificationAdapter = createRequestAdapter('displayNotification').withPayloads<
    { type: 'danger' | 'success'; message: string; },
    void
>();