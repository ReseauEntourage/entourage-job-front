import React from 'react';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Img, SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS, STORAGE_KEYS } from 'src/constants';
import { Container } from './PopupModal.styles';

export function TaxModal() {
  return (
    <ModalGeneric
      removePadding
      onClose={(onClose) => {
        localStorage.setItem(STORAGE_KEYS.TAX_MODAL_CLOSED, String(true));

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        onClose();
      }}
    >
      <SimpleLink href={EXTERNAL_LINKS.TAX} isExternal target="_blank">
        <Container>
          <Img
            src="/static/img/tax.jpg"
            width={1080}
            height={1080}
            alt="Taxe d'apprentissage"
          />
        </Container>
      </SimpleLink>
    </ModalGeneric>
  );
}
