import React, { useCallback, useEffect, useState } from 'react';

import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';

/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */

type composersType = Array<
  (close: () => void, next: () => void, previous: () => void) => React.ReactNode
>;

interface StepperModalProps {
  composers: composersType;
  title: React.ReactNode;
}

export const StepperModal = ({ composers, title }: StepperModalProps) => {
  const [index, setIndex] = useState(0);
  const [wrappedComponents, setWrappedComponents] =
    useState<React.ReactNode[]>();

  const { onClose } = useModalContext();

  const close = useCallback(() => {
    onClose?.();
    setIndex(0);
  }, [onClose]);

  const next = useCallback(() => {
    setIndex((prevIndex) => {
      return prevIndex + 1;
    });
  }, []);

  const previous = useCallback(() => {
    setIndex((prevIndex) => {
      return prevIndex - 1;
    });
  }, []);

  useEffect(() => {
    if (composers) {
      setWrappedComponents(
        composers.map((composer) => {
          return composer(close, next, previous);
        })
      );
    }
  }, [close, composers, next, previous]);

  return (
    <ModalGeneric
      title={title}
      onClose={() => {
        setIndex(0);
        onClose?.();
      }}
    >
      {wrappedComponents && wrappedComponents[index]}
    </ModalGeneric>
  );
};
