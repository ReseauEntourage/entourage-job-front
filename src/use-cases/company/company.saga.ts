import { call, put, select, takeLatest } from 'typed-redux-saga';
import { assertIsDefined } from '@/src/utils/asserts';
import { Api } from 'src/api';
import { selectSelectedCompanyId } from './company.selectors';
import { slice } from './company.slice';

const {
  fetchSelectedCompanyRequested,
  fetchSelectedCompanySucceeded,
  fetchSelectedCompanyFailed,
} = slice.actions;

function* fetchSelectedCompanySaga() {
  try {
    const companyId = yield* select(selectSelectedCompanyId);

    assertIsDefined(companyId, 'Company ID must be defined');
    const { data } = yield* call(() => Api.getCompanyById(companyId));
    yield* put(fetchSelectedCompanySucceeded(data || null));
  } catch (error) {
    yield* put(fetchSelectedCompanyFailed(null));
  }
}

export function* saga() {
  yield* takeLatest(
    fetchSelectedCompanyRequested.type,
    fetchSelectedCompanySaga
  );
}
