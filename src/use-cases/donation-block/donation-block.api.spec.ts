jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { donationBlockApi } from './donation-block.api';

const mockedApi = getMockedApi();

const selectDonationBlock = (store: ReturnType<typeof createTestStore>) =>
  donationBlockApi.endpoints.getDonationBlock.select()(store.getState());

describe('donation block api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDonationBlock', () => {
    [true, false].forEach((visible) => {
      it(`stores visibility ${visible}`, async () => {
        const store = createTestStore();
        mockedApi.getCurrentDonationBlock.mockResolvedValue({
          data: { visible },
        } as never);

        store.dispatch(donationBlockApi.endpoints.getDonationBlock.initiate());
        await flushPromises();

        expect(selectDonationBlock(store).data).toEqual({ visible });
      });
    });

    it('stores the error when the request fails', async () => {
      const store = createTestStore();
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedApi.getCurrentDonationBlock.mockRejectedValue(new Error('nope'));

      store.dispatch(donationBlockApi.endpoints.getDonationBlock.initiate());
      await flushPromises();

      expect(selectDonationBlock(store).isError).toBe(true);
    });
  });

  describe('dismissDonationBlock', () => {
    const loadVisibleBlock = async (
      store: ReturnType<typeof createTestStore>
    ) => {
      mockedApi.getCurrentDonationBlock.mockResolvedValue({
        data: { visible: true },
      } as never);
      store.dispatch(donationBlockApi.endpoints.getDonationBlock.initiate());
      await flushPromises();
    };

    it('hides the block once the dismissal is sent', async () => {
      const store = createTestStore();
      await loadVisibleBlock(store);
      mockedApi.postDismissDonationBlock.mockResolvedValue({} as never);

      store.dispatch(
        donationBlockApi.endpoints.dismissDonationBlock.initiate()
      );
      await flushPromises();

      expect(mockedApi.postDismissDonationBlock).toHaveBeenCalledTimes(1);
      expect(selectDonationBlock(store).data).toEqual({ visible: false });
    });

    it('brings the block back when the dismissal fails', async () => {
      const store = createTestStore();
      await loadVisibleBlock(store);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedApi.postDismissDonationBlock.mockRejectedValue(new Error('nope'));

      store.dispatch(
        donationBlockApi.endpoints.dismissDonationBlock.initiate()
      );
      await flushPromises();

      expect(selectDonationBlock(store).data).toEqual({ visible: true });
    });
  });
});
