import { useCallback } from 'react';
import Resizer from 'react-image-file-resizer';
import UIkit from 'uikit';

export function useUploadImage() {
  const resizeFile = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        2000,
        1500,
        'JPEG',
        75,
        0,

        (uri) => {
          resolve(uri as Blob);
        },
        'blob'
      );
    });
  }, []);

  return useCallback(
    async (file: File) => {
      if (file) {
        if (!file.type.includes('image/')) {
          UIkit.notification('Le fichier doit être une image', 'danger');
        }

        const image = await resizeFile(file);
        const profileImageObjectUrl = URL.createObjectURL(image);

        return {
          profileImage: image,
          profileImageObjectUrl,
        };
      }
      return null;
    },
    [resizeFile]
  );
}
