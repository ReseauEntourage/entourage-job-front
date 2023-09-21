import { useEffect, useState } from 'react';
import { OpportunityWithOpportunityUsers } from 'src/api/types';

export function useModalOffer(currentOffer: OpportunityWithOpportunityUsers) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [offer, setOffer] =
    useState<OpportunityWithOpportunityUsers>(currentOffer);

  useEffect(() => {
    setOffer(currentOffer);
  }, [currentOffer]);

  useEffect(() => {
    setIsEditing(false);
  }, [offer]);

  return {
    loading,
    setLoading,
    isEditing,
    setIsEditing,
    offer,
    setOffer,
  };
}
