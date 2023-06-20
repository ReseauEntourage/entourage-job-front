import { useEffect, useState } from 'react';

export function useModalOffer(currentOffer) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [offer, setOffer] = useState(currentOffer);

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
