import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { LegacyImg } from '@/src/components/utils';
import { StyledContainerMarginY } from '@/src/components/utils/Containers/Containers.styles';
import { useProfileGeneration } from '@/src/hooks';
import { IlluCV } from 'assets/icons/icons';
import { Button } from 'src/components/utils/Button/Button';
import { StyledCenteredButtonContainer } from 'src/components/utils/Button/Button.styles';
import { ContainerWithTextCentered } from 'src/components/utils/Containers/ContainerWithTextCentered';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Text } from 'src/components/utils/Text';

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
              <>
                <LegacyImg
                  src="/static/img/illustrations/cv-ia.gif"
                  width={150}
                  height={150}
                  alt="Chargement en cours"
                />
                <StyledContainerMarginY margin="20px" />
                <Text weight="bold" size="normal" center>
                  Patientez quelques secondes ...
                </Text>
              </>
            ) : (
              <IlluCV width={226} height={226} />
            )}
          </StyledImageContainer>
          {!noAction && (
            <StyledCenteredButtonContainer>
              <Button
                variant="primary"
                rounded
                size="large"
                onClick={generateProfileFromCV}
                disabled={isLoading}
              >
                Générer mon profil avec l&apos;IA&nbsp;
                <LucidIcon name="WandSparkles" size={20} />
              </Button>
            </StyledCenteredButtonContainer>
          )}
          <StyledContainerMarginY margin="20px" />
          <Text size="small" center>
            En utilisant ce service, vous acceptez également les Conditions
            Générales d&apos;Utilisation d&apos;OpenAI. Vos données sont
            traitées par OpenAI dans le but de générer votre profil à partir de
            votre CV importé. Elles sont conservées par Entourage Pro qu&apos;en
            accord avec notre Politique de Confidentialité.
          </Text>
        </ContainerWithTextCentered>
      </>
    );
  }
);
