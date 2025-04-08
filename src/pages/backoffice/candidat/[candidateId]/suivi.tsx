import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Button, Grid, Section } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';

import { TextArea } from 'src/components/utils/Inputs';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

const Suivi = () => {
  const user = useAuthenticatedUser();
  const [userCandidat, setUserCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<string>();
  const candidateId = useCandidateId();

  const prevUser = usePrevious(user);
  const dispatch = useDispatch();

  const title =
    user.role === USER_ROLES.CANDIDATE
      ? 'Suivez votre progression'
      : `Suivi du candidat - ${`${
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          userCandidat?.candidat?.firstName
        } ${
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          userCandidat?.candidat?.lastName
        }`}`;
  const description =
    user.role === USER_ROLES.CANDIDATE
      ? "Ici, vous pouvez prendre des notes sur la progression de vos recherches, noter vos différents rendez-vous, etc. et échanger avec votre coach. Profitez de cet espace d'écriture libre qui vous est dédié !"
      : "Ici, vous pouvez suivre la progression de votre candidat.e grâce à ses notes, et échanger avec lui/elle. Profitez de cet espace d'échange libre qui vous est dédié !";

  const updateValue = useCallback((text) => {
    setValue(text || '');
  }, []);

  const updateSuivi = useCallback(
    async (note) => {
      try {
        await Api.putCandidate(
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          userCandidat.candidat.id,
          {
            note,
          }
        );
        setUserCandidat((prevUserCandidat) => ({
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...prevUserCandidat,
          note,
        }));
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: 'Suivi sauvegardé',
          })
        );
      } catch (err) {
        console.error(err);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: 'Erreur lors de la mise à jour du suivi',
          })
        );
      }
    },
    [userCandidat, dispatch]
  );

  const sendNoteHasBeenRead = useCallback(async () => {
    if (
      user.role !== USER_ROLES.ADMIN &&
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      userCandidat?.candidat?.id
    ) {
      try {
        await Api.putCandidateRead(
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          userCandidat.candidat.id
        );
      } catch (err) {
        console.error(err);
      }
    }
  }, [user, userCandidat]);

  useEffect(() => {
    if (user !== prevUser) {
      setLoading(true);
      Api.getUserCandidate()
        .then(({ data }) => {
          setUserCandidat(data);
          sendNoteHasBeenRead();
          updateValue(data.note);
        })
        .catch(() => {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: 'Erreur lors du chargement du suivi',
            })
          );
        })
        .finally(() => {
          return setLoading(false);
        });
    }
  }, [prevUser, dispatch, sendNoteHasBeenRead, user, candidateId, updateValue]);

  let content;
  if (loading) {
    content = <LoadingScreen />;
  } else if (!userCandidat) {
    content = (
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">
            {user.role === USER_ROLES.COACH
              ? 'Aucun candidat'
              : 'Aucun bénévole coach'}
          </span>{' '}
          n&apos;est rattaché à ce compte.
        </h2>
        <p>
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          Entourage Pro pour en savoir plus.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <HeaderBackoffice title={title} description={description} />
        <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
          <TextArea
            id="textarea-suivi"
            name="textarea-suivi"
            rows={10}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            value={value}
            onChange={updateValue}
            showLabel
            placeholder="Tapez votre texte"
            title={title}
          />
        </div>
        <Grid match className="uk-flex-right">
          <Button
            variant="default"
            onClick={() => {
              updateValue(
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                userCandidat.note
              );
            }}
            disabled={
              value ===
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              userCandidat.note
            }
          >
            <LucidIcon name="History" />
          </Button>
          <Button
            variant="default"
            onClick={() => updateSuivi(value)}
            disabled={
              value ===
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              userCandidat.note
            }
          >
            Sauvegarder
          </Button>
        </Grid>
      </>
    );
  }

  return (
    <LayoutBackOffice title={title}>
      <Section className="custom-page">{content}</Section>
    </LayoutBackOffice>
  );
};

export default Suivi;
