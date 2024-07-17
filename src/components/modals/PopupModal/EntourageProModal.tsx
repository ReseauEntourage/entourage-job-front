import React, { useCallback } from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import { ModalGeneric } from '../Modal/ModalGeneric';
import { H2 } from 'src/components/utils/Headings';
import { STORAGE_KEYS } from 'src/constants';
import { StyledEntourageProModal } from './PopupModal.styles';

export const EntourageProModal = () => {
  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.ENTOURAGE_PRO_MODAL_CLOSED, String(true));
  }, []);
  return (
    <ModalGeneric
      onClose={(onClose) => {
        handleClose();
        if (onClose) onClose();
      }}
    >
      <StyledEntourageProModal>
        <EntourageProLogoPrimary height={60} width={220} />
        <H2
          center
          title={
            <>
              Linkedout évolue. <br /> Bienvenue sur Entourage Pro.
            </>
          }
          color="primaryBlue"
        />
        <p>
          Votre plateforme se réinvente pour devenir un véritable réseau : le
          premier vrai réseau professionnel solidaire.
        </p>
        <p>
          Entourage Pro, c’est un nouvel outil plus simple, une expérience plus
          personnalisée, conçue autour de 2 formats, 360 et Coup de pouce, qui
          s&lsquo;adaptent à tout un chacun.
        </p>
        <p>
          Mais Entourage Pro, c’est avant tout la même ambition : accompagner
          les plus exclus vers l’emploi en leur créant ce qui leur manque le
          plus pour y accéder : un réseau.
        </p>
        {/* <Button
          href=""
          style="custom-secondary-inverted"
          onClick={() => {
            handleClose();
          }}
        >
          Obtenir plus d&lsquo;infos
        </Button> */}
      </StyledEntourageProModal>
    </ModalGeneric>
  );
};
