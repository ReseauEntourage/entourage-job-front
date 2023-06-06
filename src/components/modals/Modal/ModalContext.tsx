import { Context, createContext, useContext } from 'react';

export const ModalContext: Context<{ onClose?: () => void }> = createContext(
  {}
);

export function useModalContext() {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error("You can't use useModalContext() outside modal");
  }

  return modalContext;
}
