import { Text, Alert, LucidIcon } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { COLORS } from '@/src/constants/styles';
import { ElearningAnswer } from '../elearning.types';
import { StyledElearningUnitQuizSuccessContainer } from './ElearningUnit.styles';

interface ElearningUnitQuizSuccessProps {
  correctAnswer: ElearningAnswer;
  isCorrect: boolean;
}

export const ElearningUnitQuizSuccess = ({
  correctAnswer,
  isCorrect,
}: ElearningUnitQuizSuccessProps) => {
  return (
    <Alert
      type={isCorrect ? AlertType.Info : AlertType.Error}
      icon={null}
      variant="outlined"
    >
      <StyledElearningUnitQuizSuccessContainer>
        <Text center>
          <LucidIcon
            name={isCorrect ? 'BadgeCheck' : 'BadgeAlert'}
            color={isCorrect ? COLORS.darkBlue : COLORS.lightRed}
            size={72}
          />
        </Text>
        <Text weight="semibold" size="large" center>
          {isCorrect ? 'Bonne réponse !' : "Ce n'est pas la bonne réponse."}
        </Text>
        {correctAnswer.explanation && (
          <Alert type={AlertType.NeutralWhite} icon={null}>
            <Text weight="semibold">Explication :</Text>
            <Text size="large">{correctAnswer.explanation}</Text>
          </Alert>
        )}
      </StyledElearningUnitQuizSuccessContainer>
    </Alert>
  );
};
