import React from 'react';
import { NetworkDirectory } from '@/src/features/backoffice/network-directory/NetworkDirectory';
import { useNetworkDirectoryRedirection } from '@/src/features/backoffice/network-directory/hooks/useNetworkDirectoryRedirection';

const Annuaire = () => {
  useNetworkDirectoryRedirection();

  return <NetworkDirectory />;
};

export default Annuaire;
