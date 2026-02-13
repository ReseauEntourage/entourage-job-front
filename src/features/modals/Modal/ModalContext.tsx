import { Context, createContext, useContext } from 'react';
import { assertIsDefined } from 'src/utils/asserts';

export const ModalContext: Context<{ onClose?: () => void }> = createContext(
  {}
);

export function useModalContext() {
  const modalContext = useContext(ModalContext);

  assertIsDefined(
    modalContext,
    "You can't use useModalContext() outside modal"
  );

  return modalContext;
}
