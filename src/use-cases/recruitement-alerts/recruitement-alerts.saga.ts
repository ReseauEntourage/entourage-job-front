import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'typed-redux-saga';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import { RecruitementAlertDto } from 'src/api/types';
import { slice } from './recruitement-alerts.slice';

const {
  fetchRecruitementAlertsRequested,
  fetchRecruitementAlertsSucceeded,
  fetchRecruitementAlertsFailed,
  createRecruitementAlertRequested,
  createRecruitementAlertSucceeded,
  createRecruitementAlertFailed,
  deleteRecruitementAlertRequested,
  deleteRecruitementAlertSucceeded,
  deleteRecruitementAlertFailed,
  updateRecruitementAlertRequested,
  updateRecruitementAlertSucceeded,
  updateRecruitementAlertFailed,
  fetchRecruitementAlertMatchingRequested,
  fetchRecruitementAlertMatchingSucceeded,
  fetchRecruitementAlertMatchingFailed,
  fetchRecruitementAlertsAction,
  createRecruitementAlertAction,
  deleteRecruitementAlertAction,
  updateRecruitementAlertAction,
  fetchRecruitementAlertMatchingAction,
} = slice.actions;

function* fetchRecruitementAlertsSaga() {
  try {
    yield* put(fetchRecruitementAlertsRequested(undefined));
    const { data } = yield* call(() => Api.getRecruitementAlerts());
    yield* put(fetchRecruitementAlertsSucceeded(data));
  } catch (error) {
    console.error('Error fetching recruitement alerts:', error);
    yield* put(fetchRecruitementAlertsFailed(undefined));
  }
}

function* createRecruitementAlertSaga(
  action: PayloadAction<RecruitementAlertDto>
) {
  try {
    yield* put(createRecruitementAlertRequested(action.payload));
    const { data } = yield* call(() =>
      Api.createRecruitementAlert(action.payload)
    );
    yield* put(createRecruitementAlertSucceeded(data));
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: "L'alerte a été créée avec succès",
      })
    );
    // Rafraîchir la liste des alertes après la création
    yield* put(fetchRecruitementAlertsAction(undefined));
  } catch (error) {
    console.error('Error creating recruitement alert:', error);
    yield* put(createRecruitementAlertFailed(undefined));
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: "Une erreur est survenue lors de la création de l'alerte",
      })
    );
  }
}

function* fetchRecruitementAlertMatchingSaga(action: PayloadAction<string>) {
  try {
    const alertId = action.payload;
    yield* put(fetchRecruitementAlertMatchingRequested(alertId));
    const { data } = yield* call(() =>
      Api.getRecruitementAlertMatching(alertId)
    );
    // On passe l'ID de l'alerte comme meta pour pouvoir y accéder dans le reducer
    yield* put({
      type: fetchRecruitementAlertMatchingSucceeded.type,
      payload: data,
      meta: { arg: alertId },
    });
  } catch (error) {
    console.error('Error fetching recruitement alert matching:', error);
    yield* put(fetchRecruitementAlertMatchingFailed(undefined));
  }
}

function* deleteRecruitementAlertSaga(action: PayloadAction<string>) {
  try {
    const alertId = action.payload;
    yield* put(deleteRecruitementAlertRequested(alertId));
    yield* call(() => Api.deleteRecruitementAlert(alertId));
    yield* put(deleteRecruitementAlertSucceeded(alertId));
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: "L'alerte a été supprimée avec succès",
      })
    );
    // Rafraîchir la liste des alertes après la suppression
    yield* put(fetchRecruitementAlertsAction(undefined));
  } catch (error) {
    console.error('Error deleting recruitement alert:', error);
    yield* put(deleteRecruitementAlertFailed(undefined));
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: "Une erreur est survenue lors de la suppression de l'alerte",
      })
    );
  }
}

function* updateRecruitementAlertSaga(
  action: PayloadAction<{ id: string; data: RecruitementAlertDto }>
) {
  try {
    const { id, data } = action.payload;
    yield* put(updateRecruitementAlertRequested({ id, data }));
    const { data: responseData } = yield* call(() =>
      Api.updateRecruitementAlert(id, data)
    );
    yield* put(updateRecruitementAlertSucceeded(responseData));
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: "L'alerte a été mise à jour avec succès",
      })
    );
    // Rafraîchir la liste des alertes après la mise à jour
    yield* put(fetchRecruitementAlertsAction(undefined));
  } catch (error) {
    console.error('Error updating recruitement alert:', error);
    yield* put(updateRecruitementAlertFailed(undefined));
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: "Une erreur est survenue lors de la mise à jour de l'alerte",
      })
    );
  }
}

export function* saga() {
  yield* takeLatest(
    fetchRecruitementAlertsAction.type,
    fetchRecruitementAlertsSaga
  );
  yield* takeLatest(
    createRecruitementAlertAction.type,
    createRecruitementAlertSaga
  );
  yield* takeLatest(
    deleteRecruitementAlertAction.type,
    deleteRecruitementAlertSaga
  );
  yield* takeLatest(
    updateRecruitementAlertAction.type,
    updateRecruitementAlertSaga
  );
  yield* takeLatest(
    fetchRecruitementAlertMatchingAction.type,
    fetchRecruitementAlertMatchingSaga
  );
}
