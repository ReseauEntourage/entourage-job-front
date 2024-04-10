import React, { useEffect, useState } from 'react';
import EditIcon from 'assets/icons/pencil.svg';
import { ButtonIcon } from 'src/components/utils';
import { ImageInput } from 'src/components/utils/Inputs';
import { Spinner } from 'src/components/utils/Spinner';
import { useIsDesktop } from 'src/hooks/utils';
import { addPrefix } from 'src/utils';
import {
  StyledEditPicture,
  StyledEditPictureButton,
  StyledEditPictureContainer,
} from './CVEdit.styles';

interface CVEditPictureProps {
  urlImg: string;
  onChange: ({ profileImage }: { profileImage: Blob }) => void;
  disablePicture?: boolean;
  imageUploading?: boolean;
}

export const CVEditPicture = ({
  urlImg,
  onChange,
  disablePicture,
  imageUploading,
}: CVEditPictureProps) => {
  const [url, setUrl] = useState<string>(urlImg);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);

  return (
    <StyledEditPictureContainer className={!isDesktop ? 'mobile' : ''}>
      <StyledEditPicture
        className={!isDesktop ? 'mobile' : ''}
        style={{
          backgroundImage: `url(${addPrefix(url)})`,
        }}
      />
      {!disablePicture && (
        <StyledEditPictureButton>
          {imageUploading ? (
            <Spinner />
          ) : (
            <ImageInput
              onChange={({ profileImage, profileImageObjectUrl }) => {
                onChange({
                  profileImage,
                });
                setUrl(profileImageObjectUrl);
              }}
              id="cv-picture-upload"
              name="cv-picture-upload"
            >
              <ButtonIcon icon={<EditIcon />} />
            </ImageInput>
          )}
        </StyledEditPictureButton>
      )}
      ;
    </StyledEditPictureContainer>
  );
};
