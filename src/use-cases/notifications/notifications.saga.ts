import { delay, put, takeEvery, takeLatest } from 'typed-redux-saga';
import { slice } from './notifications.slice';
import { v4 as uuid } from 'uuid';

const {
    addNotification,
    removeNotification,
    displayNotificationRequested,
    displayNotificationSucceeded,
} = slice.actions;

function* displayNotification(
    action: ReturnType<typeof displayNotificationRequested>
    ) {
    const id =  uuid();
    yield* put(addNotification({id, ...action.payload}));
    yield* delay(5000);
    yield* put(removeNotification({ id }));
    yield* put(displayNotificationSucceeded());
}

export function* saga() {
    yield* takeEvery(displayNotificationRequested, displayNotification);
}