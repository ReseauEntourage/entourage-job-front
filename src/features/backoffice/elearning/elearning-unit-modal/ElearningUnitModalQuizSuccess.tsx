import { Text, Alert, LucidIcon } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { COLORS } from '@/src/constants/styles';
import { ElearningAnswer } from '../elearning.types';
import { StyledElearningUnitModalQuizSuccessContainer } from './ElearningUnitModal.styles';

export interface ElearningUnitModalQuizSuccessProps {
  correctAnswer: ElearningAnswer;
}

export const ElearningUnitModalQuizSuccess = ({
  correctAnswer,
}: ElearningUnitModalQuizSuccessProps) => {
  return (
    <Alert variant={AlertVariant.Info} icon={null}>
      <StyledElearningUnitModalQuizSuccessContainer>
        <Text center>
          <LucidIcon name="BadgeCheck" color={COLORS.darkBlue} size={72} />
        </Text>
        <Text weight="semibold" size="large" center>
          Bonne réponse !
        </Text>
        <Alert variant={AlertVariant.White} icon={null}>
          {correctAnswer.explaination && (
            <>
              <Text weight="semibold">Explication :</Text>
              <Text size="large">{correctAnswer.explaination}</Text>
            </>
          )}
        </Alert>
      </StyledElearningUnitModalQuizSuccessContainer>
    </Alert>
  );
};
