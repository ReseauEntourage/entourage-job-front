import { Api } from '@/src/api';
import { DonationBlock } from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';

export const donationBlockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Whether the dashboard donation block is shown to the current user. */
    getDonationBlock: builder.query<DonationBlock, void>({
      queryFn: async () => {
        try {
          const { data } = await Api.getCurrentDonationBlock();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
    }),
    /**
     * Closes the donation block for good on the account. The block disappears
     * right away (optimistic update) and comes back only if the request fails.
     */
    dismissDonationBlock: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await Api.postDismissDonationBlock();
          return { data: undefined };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          donationBlockApi.util.updateQueryData(
            'getDonationBlock',
            undefined,
            (draft) => {
              draft.visible = false;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetDonationBlockQuery, useDismissDonationBlockMutation } =
  donationBlockApi;
