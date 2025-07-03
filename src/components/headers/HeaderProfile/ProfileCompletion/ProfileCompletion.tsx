import React, { useEffect, useState } from 'react';
import { Api } from '@/src/api';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { Text } from 'src/components/utils';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export const ProfileCompletion = () => {
  // Utilisation d'un state local car on utilise le taux de completion seulement dans ce composant
  const [completionRate, setCompletionRate] = useState(0);
  const currentUser = useAuthenticatedUser();

  useEffect(() => {
    const fetchCompletionRate = async () => {
      const { data } = await Api.getProfileCompletion();
      setCompletionRate(data || 0);
    };

    fetchCompletionRate();
  }, [currentUser, currentUser?.userProfile]);

  return (
    <StyledProfileCompletion>
      <StyledHeader>
        <Text size="small" color="mediumGray">
          Votre profil
        </Text>
        <Text size="small" color="mediumGray">
          {`${completionRate}%`}
        </Text>
      </StyledHeader>
      <StyledProgressionContainer>
        <StyledProgression completionRate={completionRate} />
      </StyledProgressionContainer>
    </StyledProfileCompletion>
  );
};
