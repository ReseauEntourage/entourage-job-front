import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { SvgIcon } from '@/assets/icons/icons';
import { Button } from '@/src/components/ui/Button/Button';
import { StyledCenteredButtonContainer } from '@/src/components/ui/Button/Button.styles';
import { ContainerWithTextCentered } from '@/src/components/ui/Containers/ContainerWithTextCentered';
import { StyledContainerMarginY } from '@/src/components/ui/Containers/Containers.styles';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { Text } from '@/src/components/ui/Text';
import { OpenAILegalMention } from '@/src/features/profile/ai/OpenAILegalMention';
import { ProfileGenerationLoadingIndicator } from '@/src/features/profile/ai/ProfileGenerationLoadingIndicator';
import { useProfileGeneration } from '@/src/hooks';

const StyledImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  height: 200px;
`;

export interface ProfileGenerationProcessProps {
  title?: string;
  overwriteWarning?: boolean;
  noAction?: boolean;
  onProfileGenerated?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export interface ProfileGenerationProcessHandle {
  generateProfileFromCV: () => void;
}

export const ProfileGenerationProcess = forwardRef<
  ProfileGenerationProcessHandle,
  ProfileGenerationProcessProps
>(
  (
    {
      title,
      overwriteWarning = false,
      noAction = false,
      onProfileGenerated,
      onLoadingChange,
    }: ProfileGenerationProcessProps,
    ref
  ) => {
    const { generateProfileFromCV, isLoading } = useProfileGeneration({
      onProfileGenerated: () => {
        if (onProfileGenerated) {
          onProfileGenerated();
        }
      },
    });

    useImperativeHandle(ref, () => ({
      generateProfileFromCV,
    }));

    useEffect(() => {
      if (onLoadingChange) {
        onLoadingChange(isLoading);
      }
    }, [isLoading, onLoadingChange]);

    return (
      <>
        <ContainerWithTextCentered>
          {title && (
            <Text weight="bold" size="xlarge" center>
              {title}
            </Text>
          )}
          <StyledContainerMarginY margin="20px" />
          {overwriteWarning && (
            <Text size="large" color="darkGray" center>
              Les informations déjà présentes sur votre profil seront écrasées.
            </Text>
          )}
          <StyledContainerMarginY margin="20px" />
          <Text size="large" color="darkGray" center>
            Cette fonctionnalité vous permet de récupérer les informations de
            votre CV et les ajouter directement à votre profil. Ex: vos
            expériences, formations, compétences et un résumé professionnel.
          </Text>
          <StyledImageContainer>
            {isLoading ? (
              <ProfileGenerationLoadingIndicator />
            ) : (
              <SvgIcon name="IlluCV" width={226} height={226} />
            )}
          </StyledImageContainer>
          {!noAction && (
            <StyledCenteredButtonContainer>
              <Button
                variant="primary"
                rounded
                size="medium"
                onClick={generateProfileFromCV}
                disabled={isLoading}
              >
                Générer mon profil avec l&apos;IA&nbsp;
                <LucidIcon name="WandSparkles" size={20} />
              </Button>
            </StyledCenteredButtonContainer>
          )}
          <StyledContainerMarginY margin="20px" />
          <OpenAILegalMention />
        </ContainerWithTextCentered>
      </>
    );
  }
);
