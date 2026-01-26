import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, ImgUserProfile, LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import { ImageInput } from '@/src/components/ui/Inputs/ImageInput/ImageInput';
import { TextArea } from '@/src/components/ui/Inputs/TextArea/TextArea';
import { Spinner } from '@/src/components/ui/Spinner';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useFileActivator } from '@/src/hooks/useFileActivator';
import { currentUserActions } from '@/src/use-cases/current-user';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
  StyledPhotoInputContainer,
  StyledPhotoRow,
  StyledPhotosAndIntroductionContainer,
} from '../Content.styles';
import { ProfileCompletionFormValues } from '../types';

export const PersonalInfoAccordion = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    control,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  useEffect(() => {
    if (submitCount > 0 && !!errors.introduction) {
      setIsOpen(true);
    }
  }, [errors.introduction, submitCount]);

  const { setFileInputRef, requestFileUploadClick } = useFileActivator();
  const user = useAuthenticatedUser();
  const dispatch = useDispatch();

  const [imageUploading, setImageUploading] = React.useState<boolean>(false);

  const uploadProfileImage = useCallback(
    async ({ profileImage: newProfileImage }: { profileImage: Blob }) => {
      setImageUploading(true);
      dispatch(
        currentUserActions.updateUserProfilePictureRequested({
          profileImage: newProfileImage,
        })
      );
    },
    [dispatch]
  );

  const introductionPlaceholder = useMemo(() => {
    if (user.role === UserRoles.CANDIDATE) {
      return 'Exemple : En recherche d’emploi dans le secteur automobile en tant que commercial, je souhaite être accompagné(e) pour clarifier mon projet professionnel et améliorer mes candidatures.\nMotivé(e) à apprendre, échanger et créer de nouvelles opportunités.';
    }
    return 'Exemple : Coach bénévole avec 10 années d’expérience en vente dans le secteur du Commerce. J’aime accompagner des personnes éloignées de l’emploi sur des sujets comme le CV, la confiance en soi ou la préparation aux entretiens. Disponible pour partager mon expérience et mon réseau.';
  }, [user.role]);

  return (
    <Accordion
      headerContent={
        <StyledAccordionHeader>
          <StyledAccordionHeaderIcon>
            <LucidIcon
              name="User"
              stroke="bold"
              color={COLORS.white}
              size={24}
            />
          </StyledAccordionHeaderIcon>
          <StyledAccordionHeaderTitleContainer>
            <H4 title="Informations personnelles" noMarginBottom />
            <Text>Photos et présentation</Text>
          </StyledAccordionHeaderTitleContainer>
        </StyledAccordionHeader>
      }
      keepContentMounted
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <StyledPhotosAndIntroductionContainer>
        <div>
          <Text weight="semibold">Photo</Text>
          <StyledPhotoRow>
            <ImgUserProfile
              user={user}
              size={150}
              hasPicture={user.userProfile?.hasPicture || false}
            />

            <StyledPhotoInputContainer>
              {imageUploading ? (
                <Spinner color={COLORS.white} />
              ) : (
                <ImageInput
                  inputRef={setFileInputRef}
                  id="onboarding-profile-picture"
                  name="onboarding-profile-picture"
                  onChange={uploadProfileImage}
                >
                  <Button variant="secondary" onClick={requestFileUploadClick}>
                    {user.userProfile?.hasPicture
                      ? 'Modifier la photo'
                      : 'Ajouter une photo'}
                  </Button>
                </ImageInput>
              )}
              <Text size="small" color="darkGray">
                Format JPG, PNG. Max 5 Mo.
              </Text>
            </StyledPhotoInputContainer>
          </StyledPhotoRow>
        </div>

        <div>
          <Controller
            control={control}
            name="introduction"
            rules={{
              required: 'Veuillez renseigner votre présentation.',
              maxLength: {
                value: 500,
                message:
                  'Votre présentation ne peut pas dépasser 500 caractères.',
              },
              minLength: {
                value: 50,
                message:
                  'Votre présentation doit contenir au moins 50 caractères.',
              },
            }}
            render={({ field }) => (
              <TextArea
                id="onboarding-introduction"
                name="onboarding-introduction"
                title={
                  <Text weight="semibold">
                    Présentation <span aria-hidden="true">*</span>
                  </Text>
                }
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={submitCount > 0 ? errors.introduction : undefined}
                showLabel
                placeholder={introductionPlaceholder}
                maxLength={500}
                minLength={50}
                rows={3}
              />
            )}
          />
        </div>
      </StyledPhotosAndIntroductionContainer>
    </Accordion>
  );
};
