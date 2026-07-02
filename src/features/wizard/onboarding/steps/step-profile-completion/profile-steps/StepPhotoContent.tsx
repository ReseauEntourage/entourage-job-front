import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
`;

const StyledRoundBadge = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px dashed ${COLORS.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${COLORS.hoverBlue};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
`;

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
  const [hasCameraDevice, setHasCameraDevice] = useState(false);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setHasCameraDevice(devices.some((d) => d.kind === 'videoinput'));
      })
      .catch(() => {});
  }, []);

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
