import NextImage from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Section } from '@/src/components/utils';

export const PinnedCommunication = () => {
  const imageUrl = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_URL;
  const linkHref = process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_URL;
  const imageRatio =
    process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_RATIO || '16/9';

  if (!imageUrl || !linkHref) {
    return null;
  }
  return (
    <Section className="custom-page">
      <div className="uk-container">
        <Link href={linkHref || '/'} target="_blank" rel="noopener noreferrer">
          <div style={{ position: 'relative', aspectRatio: imageRatio }}>
            <NextImage
              src={imageUrl}
              alt="Communication épinglée"
              priority
              style={{ width: '100%', display: 'block', borderRadius: 40 }}
              fill
            />
          </div>
        </Link>
      </div>
    </Section>
  );
};
