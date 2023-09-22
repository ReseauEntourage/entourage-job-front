import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import UIkit from 'uikit';
import { Icon } from 'src/components/utils';
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

  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);

  const resizeFile = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        2000,
        1500,
        'JPEG',
        75,
        0,
        (uri: Blob) => {
          resolve(uri);
        },
        'blob'
      );
    });
  };
  return (
    <StyledEditPictureContainer className={!isDesktop ? 'mobile' : ''}>
      <StyledEditPicture
        className={!isDesktop ? 'mobile' : ''}
        style={{ backgroundImage: `url(${addPrefix(url)})` }}
      />
      {!disablePicture && (
        <StyledEditPictureButton>
          {imageUploading ? (
            <div>
              <div data-uk-spinner="ratio: 1" />
            </div>
          ) : (
            <div data-uk-form-custom>
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ cursor: 'pointer' }}
                  onChange={async ({ target }) => {
                    const file = target.files[0];

                    if (file) {
                      if (!file.type.includes('image/')) {
                        UIkit.notification(
                          'Le fichier doit être une image',
                          'danger'
                        );
                      }

                      const image: Blob = await resizeFile(file);
                      const profileImageObjectUrl = URL.createObjectURL(image);
                      onChange({
                        profileImage: image,
                        profileImageObjectUrl,
                      });
                      setUrl(profileImageObjectUrl);
                    }
                  }}
                />
                <Icon name="pencil" />
              </label>
            </div>
          )}
        </StyledEditPictureButton>
      )}
    </StyledEditPictureContainer>
  );
};
