import React, { useMemo } from 'react';
import { CommitmentFormat } from '@/src/components/commitment-format/CommitmentFormat';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

const TeamBuildingPage = () => {
  const currentUser = useAuthenticatedUser();
  const company = useMemo(() => currentUser?.company, [currentUser.company]);

  if (!company) return null;

  return <CommitmentFormat />;
};

export default TeamBuildingPage;
