import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  CheckListElement,
  List,
  WarningListElement,
} from '@/src/components/ui/Lists';
import { UserRoles } from '@/src/constants/users';
import { useModalContext } from '../Modal';
import { PrettyModal } from '../PrettyModal/PrettyModal';

const MODAL_ID = 'elearning-skip-confirmation-modal';

interface ElearningSkipConfirmationModalProps {
  userRole: UserRoles | undefined;
  onConfirmSkip: () => void;
}

export const ElearningSkipConfirmationModal = ({
  userRole,
  onConfirmSkip,
}: ElearningSkipConfirmationModalProps) => {
  const { onClose } = useModalContext();
  const isCandidate = userRole === UserRoles.CANDIDATE;

  const handleConfirmSkip = () => {
    onConfirmSkip();
    if (onClose) {
      onClose();
    }
  };

  return (
    <PrettyModal
      id={MODAL_ID}
      icon={<LucidIcon name="GraduationCap" size={48} color="white" />}
      title="Et si vous la faisiez maintenant ?"
      subtitle="Cela ne prend que 10 minutes et change tout pour la suite :"
      submitBtnTxt="Continuer ma formation"
      secondaryAction={
        <Button variant="text" onClick={handleConfirmSkip}>
          Passer quand même, je la ferai plus tard
        </Button>
      }
    >
      <List>
        <CheckListElement>
          <Text>
            Vous comprenez votre rôle et savez quoi écrire pour créer du lien
          </Text>
        </CheckListElement>
        <CheckListElement>
          <Text>
            Vous pourrez écrire aux {isCandidate ? 'coachs' : 'candidats'} et
            être contactés
          </Text>
        </CheckListElement>
        <WarningListElement>
          <Text>Sinon, vous ne pourrez pas encore entrer en contact</Text>
        </WarningListElement>
      </List>
    </PrettyModal>
  );
};
