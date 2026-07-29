import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { assertIsDefined } from '@/src/utils/asserts';
import {
  companyApi,
  FETCH_COMPANIES_FIXED_CACHE_KEY,
  FETCH_SELECTED_COMPANY_FIXED_CACHE_KEY,
  FETCH_SELECTED_COMPANY_WITH_COLLABORATORS_FIXED_CACHE_KEY,
  INVITE_COLLABORATORS_FIXED_CACHE_KEY,
  UPDATE_COMPANY_FIXED_CACHE_KEY,
  UPDATE_COMPANY_LOGO_FIXED_CACHE_KEY,
} from './company.api';
import {
  selectCompaniesHasFetchedAll,
  selectCompaniesOffset,
  selectSelectedCompanyId,
} from './company.selectors';
import { slice } from './company.slice';

const { actions } = slice;

/** Translates `fetchCompaniesWithFiltersSaga`. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchCompaniesWithFilters,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(actions.resetCompaniesOffset());
    listenerApi.dispatch(actions.fetchCompaniesRequested(action.payload));
  },
});

/**
 * Translates `fetchCompaniesNextPageSaga`: both guards preserved — only
 * paginate past a page that itself succeeded (mirrors the original
 * `status === SUCCEEDED` reducer-level guard), and only while no fetch is
 * already in flight (mirrors the saga-level `!isFetchRequested` guard, which
 * complemented the reducer guard to avoid a stale-closure race).
 */
listenerMiddleware.startListening({
  actionCreator: actions.fetchCompaniesNextPage,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as never;
    const hasFetchedAll = selectCompaniesHasFetchedAll(state);
    const fetchCompaniesResult = companyApi.endpoints.fetchCompanies.select(
      FETCH_COMPANIES_FIXED_CACHE_KEY
    )(state);

    if (
      !hasFetchedAll &&
      fetchCompaniesResult.isSuccess &&
      !fetchCompaniesResult.isLoading
    ) {
      listenerApi.dispatch(actions.incrementCompaniesOffset());
      listenerApi.dispatch(actions.fetchCompaniesRequested(action.payload));
    }
  },
});

/** Translates `fetchCompaniesRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchCompaniesRequested,
  effect: (action, listenerApi) => {
    const offset = selectCompaniesOffset(listenerApi.getState() as never);
    listenerApi.dispatch(
      companyApi.endpoints.fetchCompanies.initiate(
        { ...action.payload, offset },
        { fixedCacheKey: FETCH_COMPANIES_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `fetchSelectedCompanySaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchSelectedCompanyRequested,
  effect: (_action, listenerApi) => {
    const companyId = selectSelectedCompanyId(listenerApi.getState() as never);
    assertIsDefined(companyId, 'Company ID must be defined');

    listenerApi.dispatch(
      companyApi.endpoints.fetchSelectedCompany.initiate(
        { companyId },
        { fixedCacheKey: FETCH_SELECTED_COMPANY_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `fetchSelectedCompanyWithCollaboratorsSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchSelectedCompanyWithCollaboratorsRequested,
  effect: (_action, listenerApi) => {
    const companyId = selectSelectedCompanyId(listenerApi.getState() as never);
    assertIsDefined(companyId, 'Company ID must be defined');

    listenerApi.dispatch(
      companyApi.endpoints.fetchSelectedCompanyWithCollaborators.initiate(
        { companyId },
        {
          fixedCacheKey:
            FETCH_SELECTED_COMPANY_WITH_COLLABORATORS_FIXED_CACHE_KEY,
        }
      )
    );
  },
});

/** Translates `updateCompanyLogoRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.updateCompanyLogoRequested,
  effect: (action, listenerApi) => {
    const { companyId, logoFile } = action.payload;
    assertIsDefined(companyId, 'Company ID must be defined');
    assertIsDefined(logoFile, 'Logo file must be defined');

    listenerApi.dispatch(
      companyApi.endpoints.updateCompanyLogo.initiate(action.payload, {
        fixedCacheKey: UPDATE_COMPANY_LOGO_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `updateCompanyRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.updateCompanyRequested,
  effect: (action, listenerApi) => {
    const { companyData } = action.payload;
    assertIsDefined(companyData, 'Company data must be defined');

    listenerApi.dispatch(
      companyApi.endpoints.updateCompany.initiate(action.payload, {
        fixedCacheKey: UPDATE_COMPANY_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `inviteCollaboratorsRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.inviteCollaboratorsRequested,
  effect: (action, listenerApi) => {
    const { companyId, emails } = action.payload;
    assertIsDefined(companyId, 'Company ID must be defined');
    assertIsDefined(emails, 'Emails must be defined');

    listenerApi.dispatch(
      companyApi.endpoints.inviteCollaborators.initiate(action.payload, {
        fixedCacheKey: INVITE_COLLABORATORS_FIXED_CACHE_KEY,
      })
    );
  },
});
