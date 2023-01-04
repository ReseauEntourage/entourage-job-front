import { useCallback, useContext } from 'react';
import { SharesCountContext } from 'src/components/store/SharesCountProvider';
import Api from 'src/api/index.ts';

export function useUpdateSharesCount() {
  const { incrementSharesCount } = useContext(SharesCountContext);

  return useCallback(
    (candidateId, type) => {
      Api.postCVCount(candidateId, type)
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
