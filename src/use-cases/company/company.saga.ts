import { call, put, select, takeLatest } from 'typed-redux-saga';
import { COMPANIES_LIMIT } from '@/src/constants';
import { assertIsDefined } from '@/src/utils/asserts';
import { currentUserActions } from '../current-user';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import {
  selectCompaniesHasFetchedAll,
  selectCompaniesOffset,
  selectSelectedCompanyId,
} from './company.selectors';
import { slice } from './company.slice';

const {
  fetchSelectedCompanyRequested,
  fetchSelectedCompanySucceeded,
  fetchSelectedCompanyFailed,
  updateCompanyLogoRequested,
  updateCompanyLogoSucceeded,
  updateCompanyLogoFailed,
  updateCompanyRequested,
  updateCompanySucceeded,
  updateCompanyFailed,
  resetCompaniesOffset,
  fetchCompaniesRequested,
  fetchCompaniesSucceeded,
  fetchCompaniesFailed,
  fetchCompaniesWithFilters,
  fetchCompaniesNextPage,
} = slice.actions;

function* fetchSelectedCompanySaga() {
  try {
    const companyId = yield* select(selectSelectedCompanyId);

    assertIsDefined(companyId, 'Company ID must be defined');
    const { data } = yield* call(() => Api.getCompanyById(companyId));
    yield* put(fetchSelectedCompanySucceeded(data));
  } catch (error) {
    yield* put(fetchSelectedCompanyFailed());
  }
}

function* updateCompanyLogoRequestedSaga(
  action: ReturnType<typeof updateCompanyLogoRequested>
) {
  try {
    const { logoFile, companyId } = action.payload;

    assertIsDefined(companyId, 'Company ID must be defined');
    assertIsDefined(logoFile, 'Logo file must be defined');

    const formData = new FormData();
    formData.append('file', logoFile);
    yield* call(() => Api.updateCompanyLogo(formData));
    yield* put(updateCompanyLogoSucceeded());
  } catch (error) {
    yield* put(updateCompanyLogoFailed(null));
  }
}

function* updateCompanyRequestedSaga(
  action: ReturnType<typeof updateCompanyRequested>
) {
  try {
    const { companyData } = action.payload;

    assertIsDefined(companyData, 'Company data must be defined');

    yield* call(() => Api.updateCompany(companyData));
    yield* put(updateCompanySucceeded());
    yield* put(currentUserActions.fetchUserRequested());
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: `Le CV a bien été importé`,
      })
    );
  } catch (error) {
    yield* put(updateCompanyFailed(null));
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: 'Une erreur est survenue',
      })
    );
  }
}

function* fetchCompaniesRequestedSaga(
  action: ReturnType<typeof fetchCompaniesRequested>
) {
  try {
    const offset = yield* select(selectCompaniesOffset);
    const limit = COMPANIES_LIMIT;

    const { departments, businessSectorIds, search } = action.payload;

    const response = yield* call(() =>
      Api.getAllCompanies({
        search,
        departments,
        businessSectorIds,
        limit,
        offset,
      })
    );
    yield* put(fetchCompaniesSucceeded(response.data));
  } catch (e) {
    yield* put(fetchCompaniesFailed());
  }
}

function* fetchCompaniesNextPageSaga(
  action: ReturnType<typeof fetchCompaniesNextPage>
) {
  const hasFetchedAll = yield* select(selectCompaniesHasFetchedAll);

  if (!hasFetchedAll) {
    yield* put(fetchCompaniesRequested(action.payload));
  }
}

function* fetchCompaniesWithFiltersSaga(
  action: ReturnType<typeof fetchCompaniesWithFilters>
) {
  yield* put(resetCompaniesOffset());
  yield* put(fetchCompaniesRequested(action.payload));
}

export function* saga() {
  yield* takeLatest(
    fetchCompaniesWithFilters.type,
    fetchCompaniesWithFiltersSaga
  );
  yield* takeLatest(fetchCompaniesNextPage.type, fetchCompaniesNextPageSaga);
  yield* takeLatest(fetchCompaniesRequested.type, fetchCompaniesRequestedSaga);
  yield* takeLatest(
    fetchSelectedCompanyRequested.type,
    fetchSelectedCompanySaga
  );
  yield* takeLatest(
    updateCompanyLogoRequested.type,
    updateCompanyLogoRequestedSaga
  );
  yield* takeLatest(updateCompanyRequested.type, updateCompanyRequestedSaga);
}
