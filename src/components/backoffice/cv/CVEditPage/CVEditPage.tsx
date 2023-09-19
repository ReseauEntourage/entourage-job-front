import Router from 'next/router';
import Pusher from 'pusher-js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { CV, User } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { Button, ButtonIcon, Grid } from 'src/components/utils';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
import { CV_STATUS, SOCKETS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded } from 'src/utils/Finding';
import { ButtonDownload } from './ButtonDownload';
import { StyledCVEditButtonsContainer } from './CVEditPage.styles';
import { CVFicheEdition } from './CVFicheEdition';
import { CVModalPreview } from './CVModalPreview';
import { NoCV } from './NoCV';

const pusher = new Pusher(process.env.PUSHER_API_KEY, {
  cluster: 'eu',
  forceTLS: true,
});

interface CVEditPageProps {
  cv: CV;
  candidateId: string;
  setCV: (updatedCV: CV) => void;
}

export const CVEditPage = ({ candidateId, cv, setCV }: CVEditPageProps) => {
  const [cvVersion, setCvVersion] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const { user } = useContext<{ user: User }>(UserContext);

  const prevCV = usePrevious(cv);

  const setCVHasBeenRead = useCallback(() => {
    if (user && user.role !== USER_ROLES.ADMIN && candidateId) {
      Api.putCVRead(candidateId)
        .then(() => {
          // console.log('Note has been read');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [candidateId, user]);

  useEffect(() => {
    return () => {
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
    };
  }, []);

  useEffect(() => {
    if (cv && cv !== prevCV) {
      if (!cvVersion) setCvVersion(cv.version);
      setImageUrl(`${process.env.AWSS3_URL}${cv.urlImg}`);
      setCVHasBeenRead();
    }
  }, [candidateId, cv, cvVersion, prevCV, setCVHasBeenRead]);

  useEffect(() => {
    const unsavedChanges = cv && cv.status === CV_STATUS.Draft.value;
    const message =
      "Voulez-vous quitter l'édition du CV? \nLes modifications que vous avez apportées ne seront peut-être pas enregistrées.";
    const routeChangeStart = (url) => {
      // eslint-disable-next-line no-alert
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);

        // Keep this string error to stop Next.js from navigating
        // eslint-disable-next-line no-throw-literal
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [cv]);

  useEffect(() => {
    if (!previewGenerating && cv) {
      // Use hash to reload image if an update is done
      const previewHash = Date.now();
      setImageUrl(
        `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${
          cv.UserId
        }.${
          cv.status === CV_STATUS.Draft.value
            ? CV_STATUS.Progress.value
            : cv.status
        }.jpg?${previewHash}`
      );
    }
  }, [cv, previewGenerating]);

  const saveUserData = (modifiedCv) => {
    return new Promise((res, rej) => {
      if (
        (modifiedCv.email || modifiedCv.phone || modifiedCv.address) &&
        (modifiedCv.email !== cv.user.candidat.email ||
          modifiedCv.phone !== cv.user.candidat.phone ||
          modifiedCv.address !== cv.user.candidat.address)
      ) {
        const userData = {
          email: modifiedCv.email,
          address: modifiedCv.address,
          phone: modifiedCv.phone,
        };

        Api.putUser(candidateId, userData)
          .then((data) => {
            res(data);
          })
          .catch((err) => {
            rej(err);
          });
      } else {
        res(null);
      }
    });
  };

  const checkIfLastVersion = useCallback(
    async (callback, isAutoSave = false) => {
      const {
        data: { lastCvVersion },
      } = await Api.getCVLastVersion(candidateId);

      if (cvVersion && lastCvVersion > cvVersion) {
        if (!isAutoSave) {
          openModal(
            <ModalConfirm
              text={
                <>
                  Une version plus récente du CV a déjà été enregistré.
                  <br />
                  <br />
                  Si vous sauvegardez vos modifications, vous écraserez cette
                  version plus récente.
                  <br />
                  <br />
                  Voulez-vous continuer&nbsp;? Si non, faites une copie de vos
                  modifications et rafraîchissez la page.
                </>
              }
              onConfirm={async () => {
                await callback();
              }}
              title="Nouvelle version du CV disponible"
              buttonText="Sauvegarder quand même"
            />
          );
        }
      } else {
        await callback();
      }
    },
    [candidateId, cvVersion]
  );

  const postCV = async (status) => {
    await checkIfLastVersion(() => {
      const channelPreview = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      const channelPDF = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);

      setPreviewGenerating(true);
      setPdfGenerating(true);

      channelPreview.bind(SOCKETS.EVENTS.CV_PREVIEW_DONE, (data) => {
        if (data.candidateId === candidateId) {
          setPreviewGenerating(false);
          pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
        }
      });

      channelPDF.bind(SOCKETS.EVENTS.CV_PDF_DONE, (data) => {
        if (data.candidateId === candidateId) {
          setPdfGenerating(false);
          pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
        }
      });

      // prepare data
      const formData = new FormData();
      const obj = {
        ...cv,
        status,
        profileImage: undefined,
      };
      delete obj.id;

      formData.append('cv', JSON.stringify(obj));
      formData.append('profileImage', cv.profileImage);
      // post
      return Api.postCV(cv.UserId, formData, true)
        .then(({ data }) => {
          setCV(data);
          setCvVersion(data.version);

          UIkit.notification(
            isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
              ? 'Votre CV a bien été sauvegardé'
              : 'Le profil a été mis à jour',
            'success'
          );
        })
        .catch((err) => {
          console.error(err);
          UIkit.notification("Une erreur s'est produite", 'danger');
        });
    });
  };

  const autoSaveCV = async (tempCV) => {
    await checkIfLastVersion(() => {
      const formData = new FormData();
      const obj = {
        ...tempCV,
        status: CV_STATUS.Progress.value,
        profileImage: undefined,
      };
      delete obj.id;
      formData.append('cv', JSON.stringify(obj));
      formData.append('autoSave', '');
      // post
      return saveUserData(obj)
        .then(() => {
          return Api.postCV(tempCV.UserId, formData, true);
        })
        .then(({ data }) => {
          // console.log('Auto-save succeeded.');
          setCvVersion(data.version);
        })
        .catch(() => {
          // console.log('Auto-save failed.');
        });
    }, true);
  };

  if (user === null) return null;

  // aucun CV
  if (cv === null) {
    return (
      <NoCV
        candidateId={candidateId}
        user={user}
        setCV={(cvData) => {
          setCV(cvData);
          setCvVersion(cvData.version);
        }}
      />
    );
  }

  const cvStatus = CV_STATUS[cv.status]
    ? CV_STATUS[cv.status]
    : CV_STATUS.Unknown;

  // affichage du CV
  return (
    <div>
      <Grid between middle>
        <Grid column gap="collapse">
          <div>
            Statut&nbsp;:{' '}
            <span className={`uk-text-${cvStatus.style}`}>
              {cvStatus.label}
            </span>
          </div>
          {user.role === USER_ROLES.ADMIN && (
            <div>
              Version&nbsp;:&nbsp;
              {cvVersion}
            </div>
          )}
        </Grid>
        <StyledCVEditButtonsContainer>
          <ButtonDownload
            pdfGenerating={pdfGenerating}
            candidateId={cv.UserId}
            firstName={cv.user?.candidat.firstName}
            lastName={cv.user?.candidat.lastName}
          />
          <Button
            onClick={() => {
              openModal(<CVModalPreview cv={cv} imageUrl={imageUrl} />);
            }}
            style="default"
          >
            Prévisualiser
          </Button>
          <ButtonPost
            style="primary"
            action={async () => {
              return postCV(CV_STATUS.Progress.value);
            }}
            text="Sauvegarder"
          />
          {isRoleIncluded(COACH_USER_ROLES, user.role) && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Pending.value);
              }}
              text="Soumettre"
            />
          )}
          {user.role === USER_ROLES.ADMIN && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Published.value);
              }}
              text="Publier"
            />
          )}
          {user.role === USER_ROLES.ADMIN && (
            <ButtonIcon
              name="question"
              href={process.env.TUTORIAL_CV}
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.BACKOFFICE_CV_AIDE);
              }}
            />
          )}
        </StyledCVEditButtonsContainer>
      </Grid>
      <CVFicheEdition
        email={cv.user?.candidat.email}
        phone={cv.user?.candidat.phone}
        address={cv.user?.candidat.address}
        cv={cv}
        previewGenerating={previewGenerating}
        disablePicture={user.role !== USER_ROLES.ADMIN}
        onChange={async (fields) => {
          await autoSaveCV({ ...cv, ...fields });
          setCV({
            ...cv,
            ...fields,
            status: CV_STATUS.Draft.value,
          });
        }}
        userZone={cv.user?.candidat.zone}
      />
    </div>
  );
};
