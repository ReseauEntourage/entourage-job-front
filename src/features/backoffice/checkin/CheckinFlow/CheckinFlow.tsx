import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { CheckBox } from '@/src/components/ui/Inputs/CheckBox/CheckBox';
import { Radio } from '@/src/components/ui/Inputs/Radio/Radio';
import { SelectList } from '@/src/components/ui/Inputs/SelectList/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { TextArea } from '@/src/components/ui/Inputs/TextArea/TextArea';
import { Spinner } from '@/src/components/ui/Spinner';
import {
  CheckinEmploymentType,
  CheckinExchangeFrequency,
  CheckinExchangeMode,
  CheckinPerceivedBenefitCandidate,
  CheckinPerceivedBenefitShared,
  CheckinPerceivedSupport,
  CheckinStillInTouch,
  CHECKIN_EMPLOYMENT_TYPE_LABELS,
  getPerceivedBenefitOptions,
} from '@/src/constants/checkin';
import { UserRoles } from '@/src/constants/users';
import {
  useGetCheckinQuery,
  useSubmitCheckinAnswerMutation,
} from '@/src/use-cases/checkin';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import { CheckinFinalScreenHigh } from '../CheckinFinalScreenHigh/CheckinFinalScreenHigh';
import { CheckinFinalScreenLow } from '../CheckinFinalScreenLow/CheckinFinalScreenLow';
import { CheckinFinalScreenMedium } from '../CheckinFinalScreenMedium/CheckinFinalScreenMedium';
import { CheckinIntroScreen } from '../CheckinIntroScreen/CheckinIntroScreen';
import { CheckinRatingInput } from '../CheckinRatingInput/CheckinRatingInput';
import { CheckinStepShell } from '../CheckinStepShell/CheckinStepShell';
import {
  StyledCheckinEmploymentTypeContainer,
  StyledCheckinFlow,
  StyledCheckinFlowCentered,
} from './CheckinFlow.styles';
import {
  CHECKIN_QUESTION_STEP_ORDER,
  CheckinStepId,
  exchangeFrequencyOptions,
  exchangeModeOptions,
  getQuestionTitle,
  perceivedSupportOptions,
  stillInTouchOptions,
} from './checkin-flow.constants';

// `SelectList.onChange` reports the full next selection (after its own toggle logic),
// not just the item that was clicked, so exclusivity of NOTHING_YET is resolved by
// diffing against the previous selection rather than by a per-option handler.
const resolvePerceivedBenefitsValues = (
  nextValues: string[],
  previousValues: string[]
): string[] => {
  const justAddedNothingYet =
    nextValues.includes(CheckinPerceivedBenefitShared.NOTHING_YET) &&
    !previousValues.includes(CheckinPerceivedBenefitShared.NOTHING_YET);
  if (justAddedNothingYet) {
    return [CheckinPerceivedBenefitShared.NOTHING_YET];
  }

  const justAddedOtherOptionWhileNothingYetWasSelected =
    nextValues.includes(CheckinPerceivedBenefitShared.NOTHING_YET) &&
    nextValues.length > 1;
  if (justAddedOtherOptionWhileNothingYetWasSelected) {
    return nextValues.filter(
      (value) => value !== CheckinPerceivedBenefitShared.NOTHING_YET
    );
  }

  return nextValues;
};

interface CheckinFlowProps {
  conversationId: string;
}

export const CheckinFlow = ({ conversationId }: CheckinFlowProps) => {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetCheckinQuery(conversationId, {
    skip: !conversationId,
  });
  const [submitAnswer, { isLoading: isSubmitting }] =
    useSubmitCheckinAnswerMutation();

  const [step, setStep] = useState<CheckinStepId>(CheckinStepId.INTRO);
  const [error, setError] = useState<string | null>(null);

  const [stillInTouch, setStillInTouch] = useState<CheckinStillInTouch | null>(
    null
  );
  const [exchangeModes, setExchangeModes] = useState<CheckinExchangeMode[]>([]);
  const [exchangeFrequency, setExchangeFrequency] =
    useState<CheckinExchangeFrequency | null>(null);
  const [perceivedBenefits, setPerceivedBenefits] = useState<string[]>([]);
  const [employmentType, setEmploymentType] =
    useState<CheckinEmploymentType | null>(null);
  const [perceivedSupport, setPerceivedSupport] =
    useState<CheckinPerceivedSupport | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const goToConversation = () => {
    router.push(`/backoffice/messaging?conversationId=${conversationId}`);
  };

  if (isLoading) {
    return (
      <StyledCheckinFlowCentered>
        <Spinner />
      </StyledCheckinFlowCentered>
    );
  }

  if (isError || !data || !currentUser) {
    return (
      <StyledCheckinFlowCentered>
        <Text>Une erreur est survenue, veuillez réessayer plus tard.</Text>
      </StyledCheckinFlowCentered>
    );
  }

  if (data.checkin) {
    return (
      <StyledCheckinFlowCentered>
        <Text>Vous avez déjà répondu à ce bilan. Merci !</Text>
        <Button onClick={goToConversation}>Retourner à la conversation</Button>
      </StyledCheckinFlowCentered>
    );
  }

  if (!data.eligible || !data.otherParticipant) {
    return (
      <StyledCheckinFlowCentered>
        <Text>Ce bilan n&apos;est pas (ou plus) disponible.</Text>
      </StyledCheckinFlowCentered>
    );
  }

  const otherFirstName = data.otherParticipant.firstName;
  const currentUserRole = currentUser.role as UserRoles;
  const perceivedBenefitOptions = getPerceivedBenefitOptions(currentUserRole);
  const needsEmploymentSubquestion = perceivedBenefits.includes(
    CheckinPerceivedBenefitCandidate.FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP
  );

  const submitAndAdvance = async (
    fields: Parameters<typeof submitAnswer>[0]['answer'],
    next: CheckinStepId
  ) => {
    setError(null);
    try {
      await submitAnswer({ conversationId, answer: fields }).unwrap();
      setStep(next);
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.');
    }
  };

  const handlePerceivedBenefitsChange = (nextValues: string[]) => {
    const resolvedValues = resolvePerceivedBenefitsValues(
      nextValues,
      perceivedBenefits
    );

    setPerceivedBenefits(resolvedValues);
    if (
      !resolvedValues.includes(
        CheckinPerceivedBenefitCandidate.FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP
      )
    ) {
      setEmploymentType(null);
    }
  };

  switch (step) {
    case CheckinStepId.INTRO:
      return (
        <StyledCheckinFlow $tinted>
          <CheckinIntroScreen
            otherFirstName={otherFirstName}
            onStart={() => setStep(CheckinStepId.STILL_IN_TOUCH)}
            onLater={goToConversation}
          />
        </StyledCheckinFlow>
      );

    case CheckinStepId.STILL_IN_TOUCH:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={stillInTouch !== null}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              stillInTouch &&
              submitAndAdvance({ stillInTouch }, CheckinStepId.EXCHANGE_MODES)
            }
          >
            <Radio
              id="checkin-still-in-touch"
              name="checkin-still-in-touch"
              options={stillInTouchOptions()}
              value={stillInTouch ?? ''}
              onChange={(value) =>
                setStillInTouch(value as CheckinStillInTouch)
              }
            />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.EXCHANGE_MODES:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={exchangeModes.length > 0}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              submitAndAdvance(
                { exchangeModes },
                CheckinStepId.EXCHANGE_FREQUENCY
              )
            }
          >
            {exchangeModeOptions().map((option) => (
              <CheckBox
                key={option.value}
                id={`checkin-exchange-mode-${option.value}`}
                name="checkin-exchange-modes"
                title={option.label}
                value={exchangeModes.includes(option.value)}
                onChange={(checked) =>
                  setExchangeModes((prev) =>
                    checked
                      ? [...prev, option.value]
                      : prev.filter((v) => v !== option.value)
                  )
                }
              />
            ))}
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.EXCHANGE_FREQUENCY:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={exchangeFrequency !== null}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              exchangeFrequency &&
              submitAndAdvance(
                { exchangeFrequency },
                CheckinStepId.PERCEIVED_BENEFITS
              )
            }
          >
            <Radio
              id="checkin-exchange-frequency"
              name="checkin-exchange-frequency"
              options={exchangeFrequencyOptions()}
              value={exchangeFrequency ?? ''}
              onChange={(value) =>
                setExchangeFrequency(value as CheckinExchangeFrequency)
              }
            />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.PERCEIVED_BENEFITS:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={
              perceivedBenefits.length > 0 &&
              (!needsEmploymentSubquestion || employmentType !== null)
            }
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              submitAndAdvance(
                {
                  perceivedBenefits,
                  ...(needsEmploymentSubquestion && employmentType
                    ? { employmentType }
                    : {}),
                },
                CheckinStepId.PERCEIVED_SUPPORT
              )
            }
          >
            <SelectList
              id="checkin-perceived-benefits"
              name="checkin-perceived-benefits"
              options={perceivedBenefitOptions.map((option) => ({
                value: option.value,
                label: (
                  <>
                    <SelectOptionTitleIconDescriptionLabel
                      title={option.label}
                      icon={<LucidIcon name={option.icon} />}
                      description={option.description}
                    />
                    {option.value ===
                      CheckinPerceivedBenefitCandidate.FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP &&
                      needsEmploymentSubquestion && (
                        <StyledCheckinEmploymentTypeContainer
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Radio
                            id="checkin-employment-type"
                            name="checkin-employment-type"
                            title="De quoi s'agit-il ?"
                            options={Object.values(CheckinEmploymentType).map(
                              (value) => ({
                                inputId: `checkin-employment-type-${value}`,
                                value,
                                label: CHECKIN_EMPLOYMENT_TYPE_LABELS[value],
                              })
                            )}
                            value={employmentType ?? ''}
                            onChange={(value) =>
                              setEmploymentType(value as CheckinEmploymentType)
                            }
                          />
                        </StyledCheckinEmploymentTypeContainer>
                      )}
                  </>
                ),
              }))}
              value={perceivedBenefits}
              onChange={handlePerceivedBenefitsChange}
              isMulti
            />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.PERCEIVED_SUPPORT:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={perceivedSupport !== null}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              perceivedSupport &&
              submitAndAdvance({ perceivedSupport }, CheckinStepId.RATING)
            }
          >
            <Radio
              id="checkin-perceived-support"
              name="checkin-perceived-support"
              options={perceivedSupportOptions()}
              value={perceivedSupport ?? ''}
              onChange={(value) =>
                setPerceivedSupport(value as CheckinPerceivedSupport)
              }
            />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.RATING:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.indexOf(step)}
            question={getQuestionTitle(step, currentUserRole, otherFirstName)}
            canContinue={rating !== null}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              rating &&
              submitAndAdvance(
                { rating },
                rating <= 2 ? CheckinStepId.COMMENT : CheckinStepId.FINAL
              )
            }
          >
            <CheckinRatingInput value={rating} onChange={setRating} />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.COMMENT:
      return (
        <StyledCheckinFlow>
          <CheckinStepShell
            otherFirstName={otherFirstName}
            currentIdx={CHECKIN_QUESTION_STEP_ORDER.length}
            question="Voulez-vous nous en dire plus ?"
            canContinue={comment.trim().length > 0}
            isSubmitting={isSubmitting}
            error={error}
            onContinue={() =>
              submitAndAdvance({ comment }, CheckinStepId.FINAL)
            }
            secondaryAction={{
              label: 'Passer cette question',
              onClick: () => setStep(CheckinStepId.FINAL),
            }}
          >
            <Alert type={AlertType.Info} variant="outlined" rounded={false}>
              Ce message est lu par l&apos;équipe Entourage, jamais par{' '}
              {otherFirstName}.
            </Alert>
            <br />
            <TextArea
              id="checkin-comment"
              name="checkin-comment"
              value={comment}
              onChange={setComment}
              maxLength={2000}
              rows={4}
              placeholder="Écrivez ce que vous voulez, même en quelques mots…"
            />
          </CheckinStepShell>
        </StyledCheckinFlow>
      );

    case CheckinStepId.FINAL:
    default:
      if (rating !== null && rating <= 2) {
        return (
          <StyledCheckinFlow $tinted>
            <CheckinFinalScreenLow
              conversationId={conversationId}
              currentUserRole={currentUserRole}
              otherFirstName={otherFirstName}
            />
          </StyledCheckinFlow>
        );
      }
      if (rating === 3) {
        return (
          <StyledCheckinFlow $tinted>
            <CheckinFinalScreenMedium
              conversationId={conversationId}
              currentUserRole={currentUserRole}
            />
          </StyledCheckinFlow>
        );
      }
      return (
        <StyledCheckinFlow $tinted>
          <CheckinFinalScreenHigh
            conversationId={conversationId}
            currentUserRole={currentUserRole}
            otherFirstName={otherFirstName}
          />
        </StyledCheckinFlow>
      );
  }
};
