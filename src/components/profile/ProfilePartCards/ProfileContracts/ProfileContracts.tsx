import React, { useCallback, useEffect, useState } from 'react';
import { Api } from '@/src/api';
import { Contract } from '@/src/api/types';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

interface ContractItem {
  id: string;
  name: string;
  value: boolean;
}

export interface ProfileContractsProps {
  isEditable?: boolean;
  smallCard?: boolean;
  contracts: Contract[];
}

export const ProfileContracts = ({
  isEditable = false,
  smallCard = false,
  contracts = [],
}: ProfileContractsProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const [items, setItems] = useState<ContractItem[]>([]);

  const isCompleted = contracts?.length > 0;

  const generateItems = useCallback(
    (contractsToConvert: Contract[]) => {
      return contractsToConvert.map((c) => ({
        id: c.id,
        name: c.name,
        value: contracts?.some((userContract) => userContract.id === c.id),
      }));
    },
    [contracts]
  );

  const fetchAllContracts = useCallback(async () => {
    try {
      const { data } = await Api.getAllContracts({
        limit: 50,
        offset: 0,
      });
      setItems(generateItems(data));
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [generateItems]);

  useEffect(() => {
    if (isEditable) {
      fetchAllContracts();
    }
  }, [fetchAllContracts, isEditable]);

  if (!isEditable && !isCompleted) {
    return null;
  }

  const onChange = (changedItems) => {
    setItems(changedItems);
    updateUserProfile({
      contracts: changedItems
        .filter((contract) => contract.value === true)
        .map((contract) => ({
          id: contract.id,
        })),
    });
  };

  return (
    <ProfilePartCard
      title="Types de contrats recherchés"
      isEditable={isEditable}
      isCompleted={isCompleted}
      isEmpty={false}
      smallCard={smallCard}
    >
      {isEditable ? (
        <CardToggleList
          items={items}
          isEditable={isEditable}
          onChange={(changedItems) => onChange(changedItems)}
        />
      ) : (
        <CardToggleList items={generateItems(contracts)} isEditable={false} />
      )}
    </ProfilePartCard>
  );
};
