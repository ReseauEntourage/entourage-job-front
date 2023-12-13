import React, { useEffect, useState } from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import { ButtonIcon } from '../../../../../utils';
import { useUploadImage } from 'src/hooks/useUploadImage';
import { useIsDesktop } from 'src/hooks/utils';
import { addPrefix } from 'src/utils';
import {
  StyledEditPicture,
  StyledEditPictureButton,
  StyledEditPictureContainer,
} from './CVEdit.styles';

interface CVEditPictureProps {
  urlImg?: string;
  onChange: ({
    profileImage,
    profileImageObjectUrl,
  }: {
    profileImage: Blob;
    profileImageObjectUrl: string;
  }) => void;
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

  const uploadImage = useUploadImage();

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
            <div data-uk-form-custom>
              {/* Fix hover effect */}
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={async ({ target }) => {
                    const image = await uploadImage(target);
                    if (image) {
                      const { profileImage, profileImageObjectUrl } = image;
                      onChange({
                        profileImage,
                        profileImageObjectUrl,
                      });
                      setUrl(profileImageObjectUrl);
                    }
                  }}
                />
                <ButtonIcon icon={<PencilIcon />} />
              </label>
            </div>
          )}
        </StyledEditPictureButton>
      )}
    </StyledEditPictureContainer>
  );
};
