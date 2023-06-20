import { useCallback, useContext } from 'react';
import { Api } from 'src/api';
import { SharesCountContext } from 'src/store/SharesCountProvider';

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
