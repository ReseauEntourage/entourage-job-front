import { CONTRACTS, OFFER_STATUS } from 'src/constants';

const findOfferStatus = (status) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) return currentStatus;
  return { label: 'Non défini', color: 'muted' };
};

const findContractType = (type) => {
  return CONTRACTS.find((contract) => {
    return contract.value === type;
  });
};

export { findOfferStatus, findContractType };
