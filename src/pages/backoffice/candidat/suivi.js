import UIkit from 'uikit';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/Axios';
import { Button, Grid, Section } from 'src/components/utils';
import { UserContext } from 'src/components/store/UserProvider';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { USER_ROLES } from 'src/constants';
import { IconNoSSR } from 'src/components/utils/Icon';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const Suivi = () => {
  const { user } = useContext(UserContext);
  const [userCandidat, setUserCandidat] = useState(null);
  const [labelClass, setLabelClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState();

  const title =
    user && user.role === USER_ROLES.CANDIDAT
      ? 'Suivez votre progression'
      : 'Suivi du candidat';
  const description =
    user && user.role === USER_ROLES.CANDIDAT
      ? "Ici, vous pouvez prendre des notes sur la progression de vos recherches, noter vos différents rendez-vous, etc. et échanger avec votre coach. Profitez de cet espace d'écriture libre qui vous est dédié !"
      : "Ici, vous pouvez suivre la progression de votre candidat.e grâce à ses notes, et échanger avec lui/elle. Profitez de cet espace d'échange libre qui vous est dédié !";

  const updateValue = (text) => {
    setLabelClass(text && text.length > 0 && ' stay-small');
    setValue(text || '');
  };

  const updateSuivi = (note) => {
    Api.put(`/user/candidat/${userCandidat.candidat.id}`, {
      note,
    })
      .then(() => {
        setUserCandidat({ ...userCandidat, note });
        UIkit.notification('Suivi sauvegardé', 'success');
      })
      .catch(() => {
        UIkit.notification('Erreur lors de la mise à jour du suivi', 'danger');
      });
  };

  const setNoteHasBeenRead = useCallback(() => {
    if (user && user.role !== USER_ROLES.ADMIN && userCandidat?.candidat?.id) {
      Api.put(`/user/candidat/read/${userCandidat.candidat.id}`)
        .then(() => {
          console.log('Note has been read');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, userCandidat?.candidat?.id]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const params = {};
      if (user.role === USER_ROLES.COACH) {
        params.coachId = user.id;
      }
      if (user.role === USER_ROLES.CANDIDAT) {
        params.candidatId = user.id;
      }
      Api.get(`/user/candidat/`, {
        params,
      })
        .then(({ data }) => {
          if (data) {
            setUserCandidat(data);
            setNoteHasBeenRead();
            updateValue(data.note);
          }
        })
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        })
        .finally(() => {
          return setLoading(false);
        });
    }
  }, [setNoteHasBeenRead, user]);

  let content;
  if (loading || !user) {
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
          LinkedOut pour en savoir plus.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <HeaderBackoffice title={title} description={description} />
        <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
          <label
            className={`uk-form-label ${labelClass}`}
            htmlFor="textarea-suivi"
          >
            {title}
          </label>
          <textarea
            id="textarea-suivi"
            name="text"
            rows={10}
            placeholder="Tapez votre texte"
            // maxLength={maxLength}
            value={value}
            onChange={(event) => {
              return updateValue(event.target.value);
            }}
            className="uk-textarea uk-form-large"
          />
        </div>
        <Grid match className="uk-flex-right">
          <Button
            style="default"
            onClick={() => {
              return updateValue(userCandidat.note);
            }}
            disabled={value === userCandidat.note}
          >
            <IconNoSSR name="history" />
          </Button>
          <Button
            style="default"
            onClick={() => {
              return updateSuivi(value);
            }}
            disabled={value === userCandidat.note}
          >
            Sauvegarder
          </Button>
        </Grid>
      </>
    );
  }

  return (
    <LayoutBackOffice title={title}>
      <Section>{content}</Section>
    </LayoutBackOffice>
  );
};

export default Suivi;
