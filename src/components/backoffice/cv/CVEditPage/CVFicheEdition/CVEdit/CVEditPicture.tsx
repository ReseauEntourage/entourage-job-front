import React, { useEffect, useState } from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import { ButtonIcon } from 'src/components/utils';
import { ImageInput } from 'src/components/utils/Inputs';
import { useIsDesktop } from 'src/hooks/utils';
import { addPrefix } from 'src/utils';
import {
  StyledEditPicture,
  StyledEditPictureButton,
  StyledEditPictureContainer,
} from './CVEdit.styles';

interface CVEditPictureProps {
  urlImg?: string;
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
  const [url, setUrl] = useState(urlImg);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);

  return (
    <StyledEditPictureContainer className={!isDesktop ? 'mobile' : ''}>
      <StyledEditPicture
        className={!isDesktop ? 'mobile' : ''}
        style={{
          backgroundImage: `url(${addPrefix(
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            url
          )})`,
        }}
      />
      {!disablePicture && (
        <StyledEditPictureButton>
          {imageUploading ? (
            <div>
              <div data-uk-spinner="ratio: 1" />
            </div>
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
              <ButtonIcon icon={<PencilIcon />} />
            </ImageInput>
          )}
        </StyledEditPictureButton>
      )}
      ;
    </StyledEditPictureContainer>
  );
};
