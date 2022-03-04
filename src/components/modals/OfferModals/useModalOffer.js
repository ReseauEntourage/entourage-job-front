import { useEffect, useState } from 'react';

function useModalOffer(currentOffer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [offer, setOffer] = useState(currentOffer);

  useEffect(() => {
    setError(false);
    setIsEditing(false);
  }, [offer]);

  return {
    loading,
    setLoading,
    error,
    setError,
    isEditing,
    setIsEditing,
    offer,
    setOffer,
  };
}

export default useModalOffer;
