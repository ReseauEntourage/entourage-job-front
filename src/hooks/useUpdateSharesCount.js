import { useCallback, useContext } from 'react';
import { SharesCountContext } from 'src/components/store/SharesCountProvider';
import Api from 'src/Axios';

export function useUpdateSharesCount() {
  const { incrementSharesCount } = useContext(SharesCountContext);

  return useCallback(
    (candidatId, type) => {
      Api.post('/cv/count', {
        candidatId,
        type,
      })
        .then(() => {
          incrementSharesCount();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [incrementSharesCount]
  );
}
