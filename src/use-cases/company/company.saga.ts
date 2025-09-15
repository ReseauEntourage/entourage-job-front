import { call, put, select, takeLatest } from 'typed-redux-saga';
import { assertIsDefined } from '@/src/utils/asserts';
import { Api } from 'src/api';
import { selectSelectedCompanyId } from './company.selectors';
import { slice } from './company.slice';

const {
  fetchSelectedCompanyRequested,
  fetchSelectedCompanySucceeded,
  fetchSelectedCompanyFailed,
  updateCompanyLogoRequested,
  updateCompanyLogoSucceeded,
  updateCompanyLogoFailed,
} = slice.actions;

function* fetchSelectedCompanySaga() {
  try {
    const companyId = yield* select(selectSelectedCompanyId);

    assertIsDefined(companyId, 'Company ID must be defined');
    const { data } = yield* call(() => Api.getCompanyById(companyId));
    yield* put(fetchSelectedCompanySucceeded(data));
  } catch (error) {
    yield* put(fetchSelectedCompanyFailed(null));
  }
}

function* updateCompanyLogoSaga(
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

export function* saga() {
  yield* takeLatest(
    fetchSelectedCompanyRequested.type,
    fetchSelectedCompanySaga
  );
  yield* takeLatest(updateCompanyLogoRequested.type, updateCompanyLogoSaga);
}
