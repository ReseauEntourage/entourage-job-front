import React, { useEffect, useState } from 'react';
import { Api } from '@/src/api';
import { WhatsappZone } from '@/src/api/types';
import { Button, LegacyImg, SimpleLink } from '@/src/components/ui';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { UserRoles } from '@/src/constants/users';
import { useModalContext } from '@/src/features/modals/Modal';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { StyledImageContainer } from './DashboardJoinWhatsappModal.styles';

export const DashboardJoinWhatsappModal = () => {
  const { onClose } = useModalContext();
  const [whatsappZone, setWhatsappZone] = useState<WhatsappZone | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthenticatedUser();

  useEffect(() => {
    const fetchWhatsappZone = async () => {
      try {
        const response = await Api.getCurrentWhatsappZone();
        setWhatsappZone(response.data);
      } catch (error) {
        console.error('Error fetching Whatsapp zone:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Add a small delay for better UX
      }
    };

    fetchWhatsappZone();
  }, []);

  const modalContent = (
    <>
      Pour recevoir des actualités et échanger avec les{' '}
      {user.role === UserRoles.COACH ? 'coachs' : 'candidats'} de votre région,
      scannez le QR code
      <StyledImageContainer>
        {loading && <Skeleton height="250px" width="250px" />}
        {!loading && whatsappZone && (
          <>
            <SimpleLink href={whatsappZone.url} target="_blank">
              <LegacyImg
                src={whatsappZone.qr}
                alt="QR code Whatsapp"
                width={250}
                height={250}
              />
            </SimpleLink>
          </>
        )}
        <p>
          {loading ? 'Chargement...' : whatsappZone ? whatsappZone.name : ''}
        </p>
      </StyledImageContainer>
    </>
  );

  return (
    <ModalGeneric title="Rejoindre notre groupe Whatsapp">
      {modalContent}
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} variant="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};
