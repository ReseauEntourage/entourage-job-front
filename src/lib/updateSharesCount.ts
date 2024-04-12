import { Api } from 'src/api';
import { SocialMedia } from 'src/api/types';

export const updateSharesCount = async (
  candidateId: string,
  type: SocialMedia
) => {
  try {
    await Api.postCVCount(candidateId, type);
  } catch (err) {
    console.error(err);
  }
};
