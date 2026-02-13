import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REFERING_FIRST_STEP } from '../Refering.types';
import { selectIsEmptyReferingData } from 'src/use-cases/refering';

export function useConfirmationRedirection() {
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const isEmptyReferingData = useSelector(selectIsEmptyReferingData);

  useEffect(() => {
    if (isEmptyReferingData) {
      replace(`/backoffice/referer/orienter/${REFERING_FIRST_STEP}`);
    }
  }, [dispatch, replace, isEmptyReferingData]);

  return { isLoading: isEmptyReferingData };
}
