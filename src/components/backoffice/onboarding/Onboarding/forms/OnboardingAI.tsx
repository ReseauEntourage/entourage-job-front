import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Img } from '@/src/components/utils';
import { StyledContainerMarginY } from '@/src/components/utils/Containers/Containers.styles';
import { IlluCV } from 'assets/icons/icons';
import { Alert } from 'src/components/utils/Alert/Alert';
import { Button } from 'src/components/utils/Button/Button';
import { StyledCenteredButtonContainer } from 'src/components/utils/Button/Button.styles';
import { ContainerWithTextCentered } from 'src/components/utils/Containers/ContainerWithTextCentered';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Text } from 'src/components/utils/Text';
import { generateProfileFromCVSelectors, cvActions } from 'src/use-cases/cv';

const StyledImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  height: 200px;
`;

export const OnboardingAI = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(
    generateProfileFromCVSelectors.selectIsGenerateProfileFromCVRequested
  );

  const handleGenerateProfile = () => {
    dispatch(cvActions.generateProfileFromCVRequested());
  };

  return (
    <div>
      <Alert
        variant="info"
        icon={
          <Img
            src="/static/img/illustrations/baguette-magique.png"
            width={46}
            height={46}
            alt="Baguette magique"
          />
        }
      >
        L&apos;IA est une fonctionnalité qui vous permet de remplir votre profil
        en reprenant des informations de votre CV.
      </Alert>
      <StyledContainerMarginY />
      <ContainerWithTextCentered>
        <Text weight="bold" size="large" center>
          Enrichissez votre profil grâce à votre CV
        </Text>
        <Text weight="bold" size="large" center>
          Grâce à l&apos;IA nous pouvons faciliter la complétion de votre profil
        </Text>

        <StyledImageContainer>
          {isLoading ? (
            <Img
              src="/static/img/illustrations/cv-ia.gif"
              width={150}
              height={150}
              alt="Chargement en cours"
            />
          ) : (
            <IlluCV width={226} height={226} />
          )}
        </StyledImageContainer>

        <StyledCenteredButtonContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            onClick={handleGenerateProfile}
            disabled={isLoading}
          >
            Générer mon profil avec l&apos;IA&nbsp;
            <LucidIcon name="WandSparkles" size={20} />
          </Button>
        </StyledCenteredButtonContainer>
      </ContainerWithTextCentered>
    </div>
  );
};
