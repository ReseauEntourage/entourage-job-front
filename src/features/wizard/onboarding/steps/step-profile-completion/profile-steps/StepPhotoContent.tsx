import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import {
  StyledButtonsContainer,
  StyledContainer,
  StyledRoundBadge,
} from './StepPhotoContent.styles';

interface StepPhotoContentProps {
  photoObjectUrl: string | null;
  onPhotoSelected: (blob: Blob, objectUrl: string) => void;
  existingUser?: { id: string; firstName: string; role: UserRoles } | null;
  hasPicture?: boolean;
}

export const StepPhotoContent = ({
  photoObjectUrl,
  onPhotoSelected,
  existingUser,
  hasPicture = false,
}: StepPhotoContentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [hasCameraDevice, setHasCameraDevice] = useState(false);

  useEffect(() => {
    if (!isMobile || !navigator.mediaDevices?.enumerateDevices) {
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setHasCameraDevice(devices.some((d) => d.kind === 'videoinput'));
      })
      .catch(() => {});
  }, [isMobile]);

  const handleFileChange = useCallback(
    (inputEl: HTMLInputElement) => {
      const file = inputEl.files?.[0];
      if (!file) {
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      onPhotoSelected(file, objectUrl);
      inputEl.value = '';
    },
    [onPhotoSelected]
  );

  return (
    <StyledContainer>
      <StyledRoundBadge>
        {photoObjectUrl ? (
          <Image
            src={photoObjectUrl}
            alt="Photo de profil"
            width={120}
            height={120}
            unoptimized
          />
        ) : existingUser && hasPicture ? (
          <ImgUserProfile user={existingUser} hasPicture size={120} />
        ) : (
          <LucidIcon name="User" size={48} color={COLORS.darkBlue} />
        )}
      </StyledRoundBadge>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e.target)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e.target)}
      />

      <StyledButtonsContainer>
        {hasCameraDevice && (
          <Button
            variant="secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            Se prendre en photo
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Importer une photo
        </Button>
      </StyledButtonsContainer>

      <Text size="small" color="darkGray">
        Format JPG, PNG. Max 5 Mo.
      </Text>
    </StyledContainer>
  );
};
