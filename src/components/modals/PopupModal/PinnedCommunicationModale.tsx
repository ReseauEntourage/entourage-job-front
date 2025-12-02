import NextImage from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ModalGeneric } from '@/src/components/modals/Modal/ModalGeneric';
import { STORAGE_KEYS } from '@/src/constants';

export const PinnedCommunicationModale = () => {
  const title = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE;
  const imageUrl = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_URL;
  const linkHref = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_URL;
  const imageRatio =
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_RATIO || '16/9';

  if (!imageUrl || !linkHref) {
    return null;
  }
  return (
    <ModalGeneric
      size="large"
      title={title}
      onClose={(onClose) => {
        localStorage.setItem(
          STORAGE_KEYS.PINNED_COMMUNICATION_CLOSED,
          String(true)
        );
        if (onClose) onClose();
      }}
    >
      <Link href={linkHref} target="_blank" rel="noopener noreferrer">
        <div style={{ position: 'relative', aspectRatio: imageRatio }}>
          <NextImage
            src={imageUrl}
            alt="Communication épinglée"
            priority
            style={{ width: '100%', display: 'block' }}
            fill
          />
        </div>
      </Link>
    </ModalGeneric>
  );
};
