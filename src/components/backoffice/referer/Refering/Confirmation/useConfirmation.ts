import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  referingActions,
  selectReferingConfirmationStepContent,
} from 'src/use-cases/refering';

export function useConfirmation() {
  const dispatch = useDispatch();
  const pageContent = useSelector(selectReferingConfirmationStepContent);

  useEffect(() => {
    dispatch(referingActions.setReferingStep(null));

    return () => {
      dispatch(referingActions.resetReferingData());
    };
  }, [dispatch]);

  return { pageContent };
}
