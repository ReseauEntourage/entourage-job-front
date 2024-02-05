import { useCallback, useState } from 'react';
import { Api } from 'src/api';

export function useUploadProfileImage(userId: string) {
  const [imageUploading, setImageUploading] = useState(false);

  const uploadProfileImage = useCallback(
    async ({ profileImage }: { profileImage: Blob }) => {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      await Api.postProfileImage(userId, formData);
      setImageUploading(false);
    },
    [userId]
  );

  return { imageUploading, uploadProfileImage };
}
