import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCandidateAsUser } from 'src/use-cases/authentication';
import {
  cvActions,
  fetchCVSelectors,
  selectIsCurrentCVValidated,
} from 'src/use-cases/cv';
import { DashboardCVCreationStepCard } from './DashboardCVCreationStepCard';

export const DashboardStepsCard = () => {
  const dispatch = useDispatch();
  const candidate = useSelector(selectCandidateAsUser);
  const isCurrentCVValidated = useSelector(selectIsCurrentCVValidated);
  const isCVFetched = useSelector(fetchCVSelectors.selectIsFetchCVSucceeded);

  useEffect(() => {
    if (candidate?.id) {
      dispatch(cvActions.fetchCVRequested());
    }
  }, [dispatch, candidate]);

  if (!isCurrentCVValidated && isCVFetched) {
    return <DashboardCVCreationStepCard />;
  }
  return null;
};
