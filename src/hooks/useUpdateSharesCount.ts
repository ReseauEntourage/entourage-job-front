import { useCallback, useContext } from 'react';
import { Api } from 'src/api';
import { SocialMedia } from 'src/api/types';
import { SharesCountContext } from 'src/store/SharesCountProvider';

export function useUpdateSharesCount() {
  const { incrementSharesCount } = useContext(SharesCountContext);

  return useCallback(
    async (candidateId: string, type: SocialMedia) => {
      try {
        await Api.postCVCount(candidateId, type);
        incrementSharesCount();
      } catch (err) {
        console.error(err);
      }
    },
    [incrementSharesCount]
  );
}
